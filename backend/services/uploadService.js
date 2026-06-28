import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const uploadFile = async (filePath, folder = 'subdeals') => {
  const provider = process.env.UPLOAD_PROVIDER || 'local';

  if (provider === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath);
    return result.secure_url;
  }

  const relativePath = filePath.replace(/\\/g, '/').split('uploads/')[1];
  return `/uploads/${relativePath}`;
};