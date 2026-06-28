import express from 'express';
import { submitContact, getContacts, updateContact } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, authorize('admin', 'manager', 'staff'), getContacts);
router.put('/:id', protect, authorize('admin', 'manager'), updateContact);

export default router;