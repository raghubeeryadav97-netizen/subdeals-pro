import Order from '../models/Order.js';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import { generateOrderId, generateInvoiceNumber } from '../utils/generateToken.js';
import { validateCoupon } from '../services/couponService.js';
import { getSettings } from '../services/settingsService.js';
import { buildPurchaseWhatsAppUrl, sendTemplateMessage, notifyAdminWhatsApp } from '../services/whatsappService.js';
import { sendOrderConfirmation, sendPaymentSuccess, sendPaymentFailed, sendInvoiceEmail } from '../services/emailService.js';
import { generateInvoicePDF } from '../services/invoiceService.js';
import { createNotification, notifyAdmins } from '../services/notificationService.js';
import { logAction } from '../utils/auditLog.js';
import Coupon from '../models/Coupon.js';
import Referral from '../models/Referral.js';

export const createOrder = async (req, res) => {
  const { planId, duration, customerName, customerEmail, customerWhatsapp, customerCountry, couponCode, paymentMethod } = req.body;

  const plan = await Plan.findById(planId).populate('category');
  if (!plan || plan.status !== 'active') return res.status(404).json({ success: false, message: 'Plan not found' });

  const pricing = plan.durationPricing.find((d) => d.months === Number(duration));
  if (!pricing || !pricing.isAvailable || pricing.stock <= 0) {
    return res.status(400).json({ success: false, message: 'Selected duration not available' });
  }

  let discountAmount = 0;
  let coupon = null;
  if (couponCode) {
    const validation = await validateCoupon(couponCode, {
      planId: plan._id,
      categoryId: plan.category._id,
      userId: req.user?._id,
      amount: pricing.offerPrice,
    });
    if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });
    discountAmount = validation.discount;
    coupon = validation.coupon;
  }

  const finalPrice = pricing.offerPrice - discountAmount;
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + Number(duration));

  const order = await Order.create({
    orderId: generateOrderId(),
    user: req.user?._id,
    customerName,
    customerEmail,
    customerWhatsapp,
    customerCountry: customerCountry || 'India',
    plan: plan._id,
    planName: plan.name,
    duration: Number(duration),
    durationLabel: pricing.label,
    originalPrice: pricing.originalPrice,
    discountAmount,
    finalPrice,
    coupon: coupon?._id,
    couponCode: coupon?.code || '',
    paymentMethod,
    expiryDate,
    invoiceNumber: generateInvoiceNumber(),
  });

  pricing.stock -= 1;
  await plan.save();

  if (coupon) {
    coupon.usedCount += 1;
    await coupon.save();
  }

  const settings = await getSettings();
  const whatsappUrl = buildPurchaseWhatsAppUrl(order, settings);

  await sendOrderConfirmation(order);
  await sendTemplateMessage(customerWhatsapp, 'order_received', {
    customerName, planName: plan.name, duration: pricing.label, orderId: order.orderId, price: finalPrice,
  });
  await notifyAdminWhatsApp(`New Order: ${order.orderId}\nPlan: ${plan.name}\nAmount: ₹${finalPrice}\nCustomer: ${customerName}`);
  await notifyAdmins(req.app.get('io'), { title: 'New Order', message: `${order.orderId} - ${plan.name} - ₹${finalPrice}`, type: 'order', link: `/admin/orders/${order._id}` });

  await logAction(req, 'create', 'order', order._id);
  res.status(201).json({ success: true, order, whatsappUrl });
};

export const uploadPaymentScreenshot = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (req.file) {
    const { uploadFile } = await import('../services/uploadService.js');
    order.paymentScreenshot = await uploadFile(req.file.path, 'payments');
  }
  order.paymentStatus = 'uploaded';
  await order.save();

  await notifyAdminWhatsApp(`Payment uploaded for ${order.orderId} by ${order.customerName}`);
  await notifyAdmins(req.app.get('io'), { title: 'Payment Uploaded', message: order.orderId, type: 'payment' });
  res.json({ success: true, order });
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ $or: [{ user: req.user._id }, { customerEmail: req.user.email }] })
    .populate('plan', 'name logo slug')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
};

export const getOrder = async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId }).populate('plan');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus, adminNotes } = req.body;
  const order = await Order.findById(req.params.id).populate('plan');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (orderStatus) order.orderStatus = orderStatus;
  if (adminNotes) order.adminNotes = adminNotes;

  if (paymentStatus === 'approved' && order.orderStatus === 'pending') {
    order.orderStatus = 'confirmed';
    await sendPaymentSuccess(order);
    await sendTemplateMessage(order.customerWhatsapp, 'payment_approved', {
      customerName: order.customerName, planName: order.planName, price: order.finalPrice,
    });
  }

  if (paymentStatus === 'rejected') {
    order.orderStatus = 'cancelled';
    await sendPaymentFailed(order);
    await sendTemplateMessage(order.customerWhatsapp, 'payment_rejected', { customerName: order.customerName });
  }

  if (orderStatus === 'completed') {
    order.paymentStatus = 'approved';
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + order.duration);
    order.expiryDate = expiryDate;
    order.renewalDate = expiryDate;

    if (order.plan) {
      order.plan.totalSales += 1;
      await order.plan.save();
    }

    let user = order.user ? await User.findById(order.user) : await User.findOne({ email: order.customerEmail });
    if (user) {
      user.lifetimeSpending += order.finalPrice;
      user.totalOrders += 1;
      user.renewalCount += 1;
      user.currentPlan = order.plan?._id;
      user.planExpiry = expiryDate;
      const settings = await getSettings();
      const pointsPerRupee = settings.loyalty?.pointsPerRupee || 1;
      user.loyaltyPoints += Math.floor(order.finalPrice * pointsPerRupee);
      const levels = settings.loyalty || {};
      if (user.lifetimeSpending >= (levels.platinum || 10000)) user.loyaltyLevel = 'platinum';
      else if (user.lifetimeSpending >= (levels.gold || 5000)) user.loyaltyLevel = 'gold';
      else if (user.lifetimeSpending >= (levels.silver || 1000)) user.loyaltyLevel = 'silver';
      await user.save();

      if (user.referredBy) {
        const settings2 = await getSettings();
        await Referral.create({ referrer: user.referredBy, referred: user._id, order: order._id, rewardAmount: settings2.referral_reward || 50, status: 'credited' });
        await User.findByIdAndUpdate(user.referredBy, { $inc: { referralEarnings: settings2.referral_reward || 50 } });
      }
    }

    await sendTemplateMessage(order.customerWhatsapp, 'order_completed', {
      customerName: order.customerName, planName: order.planName, duration: order.durationLabel, expiryDate: expiryDate.toLocaleDateString('en-IN'),
    });
  }

  await order.save();
  await logAction(req, 'update', 'order', order._id, { orderStatus, paymentStatus });
  res.json({ success: true, order });
};

export const getAdminOrders = async (req, res) => {
  const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (search) filter.$or = [{ orderId: { $regex: search, $options: 'i' } }, { customerName: { $regex: search, $options: 'i' } }, { customerEmail: { $regex: search, $options: 'i' } }];

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter).populate('plan', 'name logo').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  res.json({ success: true, total, orders });
};

export const downloadInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const pdf = await generateInvoicePDF(order);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);
  res.send(pdf);
};

export const emailInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const pdf = await generateInvoicePDF(order);
  await sendInvoiceEmail(order, pdf);
  res.json({ success: true, message: 'Invoice emailed' });
};

export const bulkUpdateOrders = async (req, res) => {
  const { ids, orderStatus, paymentStatus } = req.body;
  await Order.updateMany({ _id: { $in: ids } }, { orderStatus, paymentStatus });
  res.json({ success: true, message: `${ids.length} orders updated` });
};