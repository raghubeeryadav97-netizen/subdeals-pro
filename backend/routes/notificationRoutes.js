import express from 'express';
import { getNotifications, markAsRead, markAllRead, archiveNotification, deleteNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllRead);
router.put('/:id/archive', protect, archiveNotification);
router.delete('/:id', protect, deleteNotification);

export default router;