import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { initDefaultSettings } from './services/settingsService.js';
import logger from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let initialized = false;

export const initApp = async () => {
  if (initialized) return;

  await connectDB();
  configureCloudinary();
  await initDefaultSettings();
  initialized = true;
};

export const createApp = async () => {
  await initApp();

  const app = express();
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://subdeals-696aa.web.app',
    'https://subdeals-696aa.firebaseapp.com',
  ].filter(Boolean);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests' },
  });

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, allowedOrigins[0]);
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use('/api/', limiter);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use('/api', apiRoutes);

  app.get('/api/seo/robots.txt', (req, res, next) => {
    req.url = '/robots.txt';
    apiRoutes(req, res, next);
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export const startCrons = async (io) => {
  if (process.env.FIREBASE_FUNCTION) return;
  const { initCronJobs } = await import('./cron/subscriptionCron.js');
  const { initBackupCron } = await import('./cron/backupCron.js');
  initCronJobs(io);
  initBackupCron();
  logger.info('Cron jobs initialized (local server only)');
};