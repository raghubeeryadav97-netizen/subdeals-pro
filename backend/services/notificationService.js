import Notification from '../models/Notification.js';

export const createNotification = async (io, { user, title, message, type = 'info', priority = 'medium', link = '', metadata = {} }) => {
  const notification = await Notification.create({ user, title, message, type, priority, link, metadata });

  if (io) {
    if (user) io.to(`user:${user}`).emit('notification', notification);
    io.to('admin').emit('notification', notification);
  }
  return notification;
};

export const notifyAdmins = async (io, { title, message, type = 'info', priority = 'medium', link = '', metadata = {} }) => {
  return createNotification(io, { user: null, title, message, type, priority, link, metadata });
};