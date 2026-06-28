import express from 'express';
import { getReviews, submitReview, getAdminReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload, setUploadFolder } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', optionalAuth, setUploadFolder('reviews'), upload.single('photo'), submitReview);
router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminReviews);
router.put('/:id', protect, authorize('admin', 'manager'), updateReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;