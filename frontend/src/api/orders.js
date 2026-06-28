import api from './axios';
import { isOfflineApiMode } from '../utils/auth';
import { getFallbackPlans } from '../data/fallbackPlans';
import { fetchCloudOrders, saveCloudOrder, updateCloudOrderStatus } from './cloudOrders';
import {
  generateOrderId,
  buildWhatsAppUrl,
  saveOfflineOrder,
  getOfflineOrders,
  normalizeOfflineOrders,
  updateOfflineOrderStatus,
} from '../utils/offlineOrders';

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
  saveCloudOrder(order).catch(() => {});

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

function getLocalOrders() {
  return normalizeOfflineOrders(getOfflineOrders());
}

async function getSyncedOrders() {
  try {
    const cloudOrders = await fetchCloudOrders();
    if (cloudOrders.length > 0) {
      const localOrders = getLocalOrders();
      const cloudIds = new Set(cloudOrders.map((o) => o.orderId));
      await Promise.all(
        localOrders
          .filter((o) => !cloudIds.has(o.orderId))
          .map((o) => saveCloudOrder(o).catch(() => {}))
      );
      return cloudOrders.length ? cloudOrders : await fetchCloudOrders();
    }
  } catch {
    // fallback to local browser storage
  }
  return getLocalOrders();
}

export function computeLocalStats(orders = getLocalOrders()) {
  const now = new Date();
  const today = now.toDateString();
  const month = now.getMonth();
  const year = now.getFullYear();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.finalPrice) || 0), 0);
  const dailyRevenue = orders
    .filter((o) => new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + (Number(o.finalPrice) || 0), 0);
  const monthlyRevenue = orders
    .filter((o) => {
      const date = new Date(o.createdAt);
      return date.getMonth() === month && date.getFullYear() === year;
    })
    .reduce((sum, o) => sum + (Number(o.finalPrice) || 0), 0);

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    totalCustomers: new Set(orders.map((o) => o.customerEmail).filter(Boolean)).size,
    totalPlans: getFallbackPlans().length,
    monthlyRevenue,
    dailyRevenue,
    pendingReviews: 0,
    openTickets: 0,
    offline: orders.length > 0,
  };
}

export function computeLocalAnalytics(orders = getLocalOrders()) {
  const byMonth = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt || Date.now());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = { revenue: 0, count: 0 };
    byMonth[key].revenue += Number(order.finalPrice) || 0;
    byMonth[key].count += 1;
  });

  const sorted = Object.keys(byMonth).sort();
  return {
    revenue: sorted.map((key) => ({ _id: key, revenue: byMonth[key].revenue })),
    orders: sorted.map((key) => ({ _id: key, count: byMonth[key].count })),
  };
}

export async function fetchDashboardStats() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/dashboard/stats');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && data?.stats) {
        return { stats: data.stats, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const orders = await getSyncedOrders();
  return { stats: computeLocalStats(orders), offline: true, cloud: orders.length > 0 };
}

export async function fetchDashboardAnalytics() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/dashboard/analytics', { params: { period: 'monthly' } });
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && data?.analytics) {
        return { analytics: data.analytics, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const orders = await getSyncedOrders();
  return { analytics: computeLocalAnalytics(orders), offline: true };
}

export async function fetchAdminOrders() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/orders/admin/all');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.orders)) {
        return { orders: data.orders, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const orders = await getSyncedOrders();
  return { orders, offline: true, cloud: orders.length > 0 };
}

export async function updateAdminOrderStatus(id, body) {
  if (!isOfflineApiMode()) {
    try {
      await api.put(`/orders/${id}/status`, body);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  updateOfflineOrderStatus(id, body);
  updateCloudOrderStatus(id, body).catch(() => {});
  return { offline: true };
}