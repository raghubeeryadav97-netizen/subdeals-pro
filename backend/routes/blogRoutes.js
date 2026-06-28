import express from 'express';
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, getAdminBlogs } from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminBlogs);
router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, authorize('admin', 'manager'), createBlog);
router.put('/:id', protect, authorize('admin', 'manager'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

export default router;