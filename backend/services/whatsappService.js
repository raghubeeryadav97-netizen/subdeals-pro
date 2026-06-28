import axios from 'axios';
import { getSettings } from './settingsService.js';
import logger from '../utils/logger.js';

const formatTemplate = (template, vars) => {
  let result = template;
  Object.entries(vars).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value ?? ''));
  });
  return result;
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const settings = await getSettings();
    if (!settings.whatsapp_enabled && process.env.WHATSAPP_ENABLED !== 'true') {
      return { success: false, message: 'WhatsApp automation disabled' };
    }

    const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    if (!token || !phoneId) {
      return { success: false, message: 'WhatsApp API not configured' };
    }

    const phone = to.replace(/\D/g, '');
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    logger.error({ message: 'WhatsApp send failed', error: error.response?.data || error.message });
    return { success: false, message: error.message };
  }
};

export const sendTemplateMessage = async (to, templateKey, vars = {}) => {
  const settings = await getSettings();
  const template = settings.whatsapp_templates?.[templateKey] || '';
  if (!template) return { success: false, message: 'Template not found' };
  const message = formatTemplate(template, vars);
  return sendWhatsAppMessage(to, message);
};

export const notifyAdminWhatsApp = async (message) => {
  const settings = await getSettings();
  const adminPhone = settings.whatsapp_number || process.env.ADMIN_WHATSAPP;
  if (!adminPhone) return { success: false };
  return sendWhatsAppMessage(adminPhone, `[SubDeals Pro Admin Alert]\n${message}`);
};

export const buildPurchaseWhatsAppUrl = (order, settings) => {
  const adminPhone = settings.whatsapp_number || process.env.ADMIN_WHATSAPP || '';
  const message = encodeURIComponent(
    `Hello,\n\nI want to purchase\nPlan: ${order.planName}\nDuration: ${order.durationLabel}\nPrice: ₹${order.finalPrice}\nCoupon: ${order.couponCode || 'None'}\nName: ${order.customerName}\nWhatsApp: ${order.customerWhatsapp}\nOrder ID: ${order.orderId}\n\nPlease confirm payment.`
  );
  return `https://wa.me/${adminPhone.replace(/\D/g, '')}?text=${message}`;
};