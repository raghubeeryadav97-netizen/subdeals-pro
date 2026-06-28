import cron from 'node-cron';
import Order from '../models/Order.js';
import Plan from '../models/Plan.js';
import { getSettings } from '../services/settingsService.js';
import { sendRenewalReminder } from '../services/emailService.js';
import { sendTemplateMessage, notifyAdminWhatsApp } from '../services/whatsappService.js';
import { notifyAdmins } from '../services/notificationService.js';
import logger from '../utils/logger.js';

const getDaysRemaining = (expiryDate) => {
  const now = new Date();
  const diff = new Date(expiryDate) - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const processReminders = async (io) => {
  try {
    const settings = await getSettings();
    const reminderDays = settings.reminder_days || [30, 15, 7, 3, 1, 0, -1, -3, -7];
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const activeOrders = await Order.find({
      orderStatus: 'completed',
      expiryDate: { $exists: true },
    }).populate('plan');

    for (const order of activeOrders) {
      const daysRemaining = getDaysRemaining(order.expiryDate);
      const reminderKey = `day_${daysRemaining}`;

      if (!reminderDays.includes(daysRemaining)) continue;
      if (order.remindersSent?.includes(reminderKey)) continue;

      const renewalLink = `${frontendUrl}/plans`;

      if (daysRemaining > 0) {
        await sendRenewalReminder(order, daysRemaining);
        await sendTemplateMessage(order.customerWhatsapp, 'subscription_expiring', {
          customerName: order.customerName,
          planName: order.planName,
          daysRemaining,
          expiryDate: order.expiryDate.toLocaleDateString('en-IN'),
          renewalLink,
        });
      } else if (daysRemaining === 0) {
        await sendTemplateMessage(order.customerWhatsapp, 'renewal_reminder', {
          customerName: order.customerName,
          planName: order.planName,
          expiryDate: order.expiryDate.toLocaleDateString('en-IN'),
          renewalLink,
        });
      } else {
        await sendTemplateMessage(order.customerWhatsapp, 'subscription_expired', {
          customerName: order.customerName,
          planName: order.planName,
          renewalLink,
        });
      }

      if (daysRemaining <= 7 && daysRemaining >= 0) {
        await notifyAdminWhatsApp(`Subscription expiring: ${order.orderId} - ${order.planName} - ${daysRemaining} days left`);
        await notifyAdmins(io, {
          title: 'Subscription Expiring',
          message: `${order.customerName} - ${order.planName} expires in ${daysRemaining} days`,
          type: 'warning',
          priority: 'high',
        });
      }

      order.remindersSent = [...(order.remindersSent || []), reminderKey];
      await order.save();
    }

    const lowStockPlans = await Plan.find({ status: 'active' });
    for (const plan of lowStockPlans) {
      const lowDurations = plan.durationPricing.filter((d) => d.stock <= 5 && d.isAvailable);
      for (const d of lowDurations) {
        await notifyAdminWhatsApp(`Low stock: ${plan.name} (${d.label}) - ${d.stock} remaining`);
      }
    }

    logger.info('Subscription cron completed');
  } catch (error) {
    logger.error({ message: 'Subscription cron failed', error: error.message });
    await notifyAdminWhatsApp(`Server Error in subscription cron: ${error.message}`);
  }
};

export const initCronJobs = (io) => {
  cron.schedule('0 8 * * *', () => processReminders(io));
  logger.info('Cron jobs initialized');
};