import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const filter = { isArchived: false };
  if (req.user.role === 'customer') filter.user = req.user._id;
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });
  res.json({ success: true, notifications, unreadCount });
};

export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
};

export const markAllRead = async (req, res) => {
  const filter = req.user.role === 'customer' ? { user: req.user._id } : {};
  await Notification.updateMany({ ...filter, isRead: false }, { isRead: true });
  res.json({ success: true });
};

export const archiveNotification = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isArchived: true });
  res.json({ success: true });
};

export const deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};