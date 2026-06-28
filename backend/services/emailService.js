import nodemailer from 'nodemailer';
import { getSettings } from './settingsService.js';
import logger from '../utils/logger.js';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;
  const settings = await getSettings();
  const host = process.env.SMTP_HOST || settings.smtp?.host;
  const port = process.env.SMTP_PORT || settings.smtp?.port || 587;
  const user = process.env.SMTP_USER || settings.smtp?.user;
  const pass = process.env.SMTP_PASS || settings.smtp?.pass;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({ host, port: Number(port), secure: false, auth: { user, pass } });
  return transporter;
};

const emailTemplate = (title, body) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:Arial,sans-serif;background:#0a0a0f;color:#fff;margin:0;padding:0}
.container{max-width:600px;margin:0 auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px;overflow:hidden}
.header{background:linear-gradient(90deg,#7c3aed,#06b6d4);padding:24px;text-align:center}
.header h1{margin:0;font-size:24px}
.content{padding:32px;line-height:1.6}
.footer{padding:16px;text-align:center;font-size:12px;color:#888;border-top:1px solid #333}
.btn{display:inline-block;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0}
</style></head><body>
<div class="container"><div class="header"><h1>SubDeals Pro</h1></div>
<div class="content"><h2>${title}</h2>${body}</div>
<div class="footer">&copy; ${new Date().getFullYear()} SubDeals Pro. All rights reserved.</div></div>
</body></html>`;

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const transport = await getTransporter();
    if (!transport) {
      logger.warn('SMTP not configured, email not sent');
      return { success: false, message: 'SMTP not configured' };
    }
    const settings = await getSettings();
    const from = process.env.SMTP_FROM || settings.smtp?.from || 'SubDeals Pro <noreply@subdealspro.com>';
    await transport.sendMail({ from, to, subject, html, attachments });
    return { success: true };
  } catch (error) {
    logger.error({ message: 'Email send failed', error: error.message });
    return { success: false, message: error.message };
  }
};

export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'Welcome to SubDeals Pro!',
    html: emailTemplate('Welcome!', `<p>Hi ${user.name},</p><p>Thank you for joining SubDeals Pro. Get premium subscriptions at unbeatable prices!</p><a class="btn" href="${process.env.FRONTEND_URL}/plans">Browse Plans</a>`),
  });
};

export const sendOrderConfirmation = async (order, user) => {
  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmed - ${order.orderId}`,
    html: emailTemplate('Order Confirmation', `<p>Hi ${order.customerName},</p><p>Your order <strong>${order.orderId}</strong> for <strong>${order.planName}</strong> (${order.durationLabel}) has been received.</p><p>Amount: ₹${order.finalPrice}</p><p>Status: ${order.orderStatus}</p>`),
  });
};

export const sendPaymentSuccess = async (order) => {
  return sendEmail({
    to: order.customerEmail,
    subject: `Payment Approved - ${order.orderId}`,
    html: emailTemplate('Payment Approved', `<p>Hi ${order.customerName},</p><p>Your payment of ₹${order.finalPrice} has been approved. Your subscription will be activated shortly.</p>`),
  });
};

export const sendPaymentFailed = async (order) => {
  return sendEmail({
    to: order.customerEmail,
    subject: `Payment Issue - ${order.orderId}`,
    html: emailTemplate('Payment Not Approved', `<p>Hi ${order.customerName},</p><p>Your payment could not be verified. Please contact support or try again.</p>`),
  });
};

export const sendRenewalReminder = async (order, daysRemaining) => {
  const link = `${process.env.FRONTEND_URL}/plans`;
  return sendEmail({
    to: order.customerEmail,
    subject: `Renewal Reminder - ${order.planName}`,
    html: emailTemplate('Subscription Expiring', `<p>Hi ${order.customerName},</p><p>Your <strong>${order.planName}</strong> expires in <strong>${daysRemaining}</strong> days.</p><a class="btn" href="${link}">Renew Now</a>`),
  });
};

export const sendPasswordReset = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: 'Password Reset - SubDeals Pro',
    html: emailTemplate('Reset Password', `<p>Hi ${user.name},</p><p>Click below to reset your password. Link expires in 1 hour.</p><a class="btn" href="${resetUrl}">Reset Password</a>`),
  });
};

export const sendInvoiceEmail = async (order, pdfBuffer) => {
  return sendEmail({
    to: order.customerEmail,
    subject: `Invoice - ${order.invoiceNumber || order.orderId}`,
    html: emailTemplate('Your Invoice', `<p>Hi ${order.customerName},</p><p>Please find your invoice attached for order ${order.orderId}.</p>`),
    attachments: [{ filename: `invoice-${order.orderId}.pdf`, content: pdfBuffer }],
  });
};

export const sendAdminNotification = async (subject, message) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@subdealspro.com';
  return sendEmail({
    to: adminEmail,
    subject: `[Admin] ${subject}`,
    html: emailTemplate(subject, `<p>${message}</p>`),
  });
};

export const sendContactNotification = async (contact) => {
  return sendAdminNotification('New Contact Message', `From: ${contact.name} (${contact.email})<br>Subject: ${contact.subject}<br>Message: ${contact.message}`);
};