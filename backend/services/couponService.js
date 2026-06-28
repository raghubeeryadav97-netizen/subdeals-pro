import Coupon from '../models/Coupon.js';

export const validateCoupon = async (code, { planId, categoryId, userId, amount }) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: 'Coupon has expired' };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }

  if (coupon.minPurchase > 0 && amount < coupon.minPurchase) {
    return { valid: false, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
  }

  if (coupon.plans?.length && !coupon.plans.some((p) => p.toString() === planId)) {
    return { valid: false, message: 'Coupon not valid for this plan' };
  }

  if (coupon.categories?.length && !coupon.categories.some((c) => c.toString() === categoryId)) {
    return { valid: false, message: 'Coupon not valid for this category' };
  }

  if (coupon.customers?.length && userId && !coupon.customers.some((c) => c.toString() === userId)) {
    return { valid: false, message: 'Coupon not valid for your account' };
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue;
  } else {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Math.min(discount, amount);

  return { valid: true, coupon, discount };
};