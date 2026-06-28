import SupportTicket from '../models/SupportTicket.js';
import { generateTicketId } from '../utils/generateToken.js';
import { notifyAdmins } from '../services/notificationService.js';
import { notifyAdminWhatsApp } from '../services/whatsappService.js';
import { sendTemplateMessage } from '../services/whatsappService.js';

export const createTicket = async (req, res) => {
  const ticket = await SupportTicket.create({
    ...req.body,
    ticketId: generateTicketId(),
    user: req.user?._id,
  });
  await notifyAdmins(req.app.get('io'), { title: 'New Support Ticket', message: ticket.subject, type: 'ticket', link: `/admin/support/${ticket._id}` });
  await notifyAdminWhatsApp(`New support ticket: ${ticket.ticketId} - ${ticket.subject}`);
  res.status(201).json({ success: true, ticket });
};

export const getMyTickets = async (req, res) => {
  const tickets = await SupportTicket.find({ $or: [{ user: req.user._id }, { customerEmail: req.user.email }] }).sort({ createdAt: -1 });
  res.json({ success: true, tickets });
};

export const getTicket = async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id).populate('replies.sender', 'name role avatar');
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, ticket });
};

export const replyTicket = async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

  const isStaff = ['admin', 'manager', 'staff'].includes(req.user.role);
  ticket.replies.push({ message: req.body.message, sender: req.user._id, isStaff });
  if (isStaff) ticket.status = req.body.status || 'pending';
  await ticket.save();

  if (isStaff && ticket.customerEmail) {
    await sendTemplateMessage(ticket.customerWhatsapp || '', 'support_reply', {
      customerName: ticket.customerName, message: req.body.message,
    });
  }
  res.json({ success: true, ticket });
};

export const getAdminTickets = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, tickets });
};

export const updateTicket = async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, ticket });
};