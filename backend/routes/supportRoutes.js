import express from 'express';
import { createTicket, getMyTickets, getTicket, replyTicket, getAdminTickets, updateTicket } from '../controllers/supportController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createTicket);
router.get('/my', protect, getMyTickets);
router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminTickets);
router.get('/:id', protect, getTicket);
router.post('/:id/reply', protect, replyTicket);
router.put('/:id', protect, authorize('admin', 'manager'), updateTicket);

export default router;