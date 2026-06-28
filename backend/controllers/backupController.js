import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import { notifyAdminWhatsApp } from '../services/whatsappService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');

export const createBackup = async (req, res) => {
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}`;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subdeals-pro';

  exec(`mongodump --uri="${uri}" --out="${path.join(backupDir, filename)}"`, async (error) => {
    if (error) {
      logger.error({ message: 'Backup failed', error: error.message });
      await notifyAdminWhatsApp(`Backup failed: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Backup failed' });
    }
    res.json({ success: true, message: 'Backup created', filename });
  });
};

export const listBackups = async (req, res) => {
  if (!fs.existsSync(backupDir)) return res.json({ success: true, backups: [] });
  const backups = fs.readdirSync(backupDir).filter((f) => f.startsWith('backup-'));
  res.json({ success: true, backups });
};

export const restoreBackup = async (req, res) => {
  const { filename } = req.body;
  const backupPath = path.join(backupDir, filename);
  if (!fs.existsSync(backupPath)) return res.status(404).json({ success: false, message: 'Backup not found' });

  const uri = process.env.MONGODB_URI;
  exec(`mongorestore --uri="${uri}" --drop "${backupPath}"`, (error) => {
    if (error) return res.status(500).json({ success: false, message: 'Restore failed' });
    res.json({ success: true, message: 'Backup restored' });
  });
};