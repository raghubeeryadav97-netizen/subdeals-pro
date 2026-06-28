import express from 'express';
import { subscribe, unsubscribe, getSubscribers, exportSubscribers } from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin', 'manager'), getSubscribers);
router.get('/export', protect, authorize('admin', 'manager'), exportSubscribers);

export default router;