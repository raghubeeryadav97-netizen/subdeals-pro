import Contact from '../models/Contact.js';
import { sendContactNotification } from '../services/emailService.js';

export const submitContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  await sendContactNotification(contact);
  res.status(201).json({ success: true, message: 'Message sent successfully' });
};

export const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, contacts });
};

export const updateContact = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, contact });
};