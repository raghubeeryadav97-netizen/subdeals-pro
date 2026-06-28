import api from './axios';
import { isOfflineApiMode } from '../utils/auth';
import { generateOrderId, buildWhatsAppUrl, saveOfflineOrder } from '../utils/offlineOrders';

function isValidOrderResponse(data) {
  return data && typeof data === 'object' && data.order;
}

function createOfflineOrder(payload, settings = {}) {
  const order = {
    orderId: generateOrderId(),
    planName: payload.planName,
    duration: payload.duration,
    durationLabel: payload.durationLabel,
    originalPrice: payload.originalPrice,
    finalPrice: payload.finalPrice,
    discountAmount: payload.discountAmount || 0,
    couponCode: payload.couponCode || '',
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerWhatsapp: payload.customerWhatsapp,
    customerCountry: payload.customerCountry || 'India',
    paymentMethod: payload.paymentMethod,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    offline: true,
  };

  saveOfflineOrder(order);
  return {
    success: true,
    order,
    whatsappUrl: buildWhatsAppUrl(order, settings.whatsapp_number),
    offline: true,
  };
}

export async function placeOrder(payload, settings = {}) {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.post('/orders', payload);
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && isValidOrderResponse(data)) {
        return data;
      }
    } catch {
      // Use offline fallback below
    }
  }

  return createOfflineOrder(payload, settings);
}