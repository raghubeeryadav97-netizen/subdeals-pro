import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory, getAdminCategories } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminCategories);
router.get('/:slug', getCategory);
router.post('/', protect, authorize('admin', 'manager'), createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;