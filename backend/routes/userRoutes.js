import express from 'express';
import { getCustomers, getCustomer, updateCustomer, getStaff, createStaff, getReferralStats } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/referrals', protect, getReferralStats);
router.get('/customers', protect, authorize('admin', 'manager', 'staff'), getCustomers);
router.get('/customers/:id', protect, authorize('admin', 'manager', 'staff'), getCustomer);
router.put('/customers/:id', protect, authorize('admin', 'manager'), updateCustomer);
router.get('/staff', protect, authorize('admin'), getStaff);
router.post('/staff', protect, authorize('admin'), createStaff);

export default router;