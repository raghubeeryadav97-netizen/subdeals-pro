import cron from 'node-cron';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import { notifyAdminWhatsApp } from '../services/whatsappService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = process.env.BACKUP_DIR || path.join(__dirname, '..', 'backups');

export const initBackupCron = () => {
  const schedule = process.env.BACKUP_CRON || '0 2 * * *';

  cron.schedule(schedule, () => {
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}`;
    const uri = process.env.MONGODB_URI;

    exec(`mongodump --uri="${uri}" --out="${path.join(backupDir, filename)}"`, async (error) => {
      if (error) {
        logger.error({ message: 'Scheduled backup failed', error: error.message });
        await notifyAdminWhatsApp(`Backup Failed: ${error.message}`);
      } else {
        logger.info(`Scheduled backup created: ${filename}`);
      }
    });
  });

  logger.info('Backup cron initialized');
};