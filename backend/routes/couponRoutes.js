import express from 'express';
import { validateCouponCode, getCoupons, createCoupon, updateCoupon, deleteCoupon, getAdminCoupons } from '../controllers/couponController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', optionalAuth, validateCouponCode);
router.get('/admin/all', protect, authorize('admin', 'manager'), getAdminCoupons);
router.get('/', protect, authorize('admin', 'manager'), getCoupons);
router.post('/', protect, authorize('admin', 'manager'), createCoupon);
router.put('/:id', protect, authorize('admin', 'manager'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;