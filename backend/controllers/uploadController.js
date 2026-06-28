import { uploadFile } from '../services/uploadService.js';
import { updateSetting } from '../services/settingsService.js';

export const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = await uploadFile(req.file.path, req.uploadFolder || 'general');
  res.json({ success: true, url });
};

export const uploadSiteAsset = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const { type } = req.body;
  const url = await uploadFile(req.file.path, 'site');
  if (type) await updateSetting(type, url);
  res.json({ success: true, url });
};