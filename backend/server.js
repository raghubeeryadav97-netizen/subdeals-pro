import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { createApp, startCrons } from './app.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  const app = await createApp();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true },
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    socket.on('join', (data) => {
      if (data.userId) socket.join(`user:${data.userId}`);
      if (data.role && ['admin', 'manager', 'staff'].includes(data.role)) socket.join('admin');
    });
  });

  await startCrons(io);

  server.listen(PORT, () => {
    logger.info(`SubDeals Pro server running on port ${PORT}`);
    console.log(`SubDeals Pro API: http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  logger.error({ message: 'Server failed to start', error: err.message });
  process.exit(1);
});