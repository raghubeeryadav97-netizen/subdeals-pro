import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { createApp } from './app.js';

const mongoUri = defineSecret('MONGODB_URI');
const jwtSecret = defineSecret('JWT_SECRET');
const jwtRefreshSecret = defineSecret('JWT_REFRESH_SECRET');

let appInstance = null;

const getApp = async () => {
  if (!appInstance) {
    process.env.MONGODB_URI = process.env.MONGODB_URI || mongoUri.value();
    process.env.JWT_SECRET = process.env.JWT_SECRET || jwtSecret.value();
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || jwtRefreshSecret.value();
    process.env.NODE_ENV = 'production';
    process.env.FIREBASE_FUNCTION = 'true';
    appInstance = await createApp();
  }
  return appInstance;
};

export const api = onRequest(
  {
    cors: true,
    memory: '1GiB',
    timeoutSeconds: 120,
    maxInstances: 10,
    secrets: [mongoUri, jwtSecret, jwtRefreshSecret],
  },
  async (req, res) => {
    const app = await getApp();
    return app(req, res);
  }
);