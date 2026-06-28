import User from '../models/User.js';
import Order from '../models/Order.js';

export const getCustomers = async (req, res) => {
  const { search } = req.query;
  const filter = { role: 'customer' };
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const customers = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, customers });
};

export const getCustomer = async (req, res) => {
  const customer = await User.findById(req.params.id).select('-password').populate('currentPlan', 'name logo');
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
  const orders = await Order.find({ $or: [{ user: customer._id }, { customerEmail: customer.email }] }).sort({ createdAt: -1 });
  res.json({ success: true, customer, orders });
};

export const updateCustomer = async (req, res) => {
  const customer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json({ success: true, customer });
};

export const getStaff = async (req, res) => {
  const staff = await User.find({ role: { $in: ['admin', 'manager', 'staff'] } }).select('-password');
  res.json({ success: true, staff });
};

export const createStaff = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const getReferralStats = async (req, res) => {
  const user = await User.findById(req.user._id);
  const referrals = await import('../models/Referral.js').then((m) => m.default.find({ referrer: req.user._id }).populate('referred', 'name email'));
  res.json({ success: true, referralCode: user.referralCode, earnings: user.referralEarnings, referrals });
};