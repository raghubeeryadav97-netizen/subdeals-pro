import express from 'express';
import { uploadImage, uploadSiteAsset } from '../controllers/uploadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, setUploadFolder } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'manager'), setUploadFolder('general'), upload.single('file'), uploadImage);
router.post('/site', protect, authorize('admin'), setUploadFolder('site'), upload.single('file'), uploadSiteAsset);

export default router;