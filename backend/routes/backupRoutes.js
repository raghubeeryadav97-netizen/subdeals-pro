import express from 'express';
import { createBackup, listBackups, restoreBackup } from '../controllers/backupController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin'), createBackup);
router.get('/', protect, authorize('admin'), listBackups);
router.post('/restore', protect, authorize('admin'), restoreBackup);

export default router;