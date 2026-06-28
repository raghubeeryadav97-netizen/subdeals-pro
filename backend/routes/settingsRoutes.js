import express from 'express';
import { getPublicSettings, getAllSettings, updateSettingsHandler, updateSingleSetting } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicSettings);
router.get('/', protect, authorize('admin'), getAllSettings);
router.put('/', protect, authorize('admin'), updateSettingsHandler);
router.put('/:key', protect, authorize('admin'), updateSingleSetting);

export default router;