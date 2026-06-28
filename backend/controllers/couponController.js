import Coupon from '../models/Coupon.js';
import { validateCoupon } from '../services/couponService.js';

export const validateCouponCode = async (req, res) => {
  const { code, planId, categoryId, amount } = req.body;
  const result = await validateCoupon(code, { planId, categoryId, userId: req.user?._id, amount });
  res.json({ success: result.valid, ...result });
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({ isActive: true });
  res.json({ success: true, coupons });
};

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
};

export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, coupon });
};

export const deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted' });
};

export const getAdminCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
};