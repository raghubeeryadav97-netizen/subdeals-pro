import express from 'express';
import { getPlans, getPlan, createPlan, updatePlan, deletePlan, duplicatePlan, getAdminPlans } from '../controllers/planController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlans);
router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminPlans);
router.get('/:slug', getPlan);
router.post('/', protect, authorize('admin', 'manager'), createPlan);
router.put('/:id', protect, authorize('admin', 'manager'), updatePlan);
router.delete('/:id', protect, authorize('admin'), deletePlan);
router.post('/:id/duplicate', protect, authorize('admin', 'manager'), duplicatePlan);

export default router;