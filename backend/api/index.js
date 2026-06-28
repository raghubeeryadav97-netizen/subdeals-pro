import { createApp } from '../app.js';

let app;

export default async function handler(req, res) {
  if (!app) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'https://subdeals-696aa.web.app';
    app = await createApp();
  }
  return app(req, res);
}