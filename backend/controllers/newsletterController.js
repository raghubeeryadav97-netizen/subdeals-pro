import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req, res) => {
  const { email } = req.body;
  const exists = await Newsletter.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Already subscribed' });
  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully' });
};

export const unsubscribe = async (req, res) => {
  await Newsletter.findOneAndUpdate({ email: req.body.email }, { isActive: false });
  res.json({ success: true, message: 'Unsubscribed' });
};

export const getSubscribers = async (req, res) => {
  const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
  res.json({ success: true, subscribers });
};

export const exportSubscribers = async (req, res) => {
  const subscribers = await Newsletter.find({ isActive: true });
  const csv = 'Email,Subscribed At\n' + subscribers.map((s) => `${s.email},${s.subscribedAt}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
  res.send(csv);
};