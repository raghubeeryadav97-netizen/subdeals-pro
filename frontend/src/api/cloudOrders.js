import { normalizeOfflineOrders } from '../utils/offlineOrders';

const DB_URL = 'https://subdeals-696aa-default-rtdb.firebaseio.com';

function buildPayload(order) {
  return {
    ...order,
    _id: order._id || order.orderId,
    orderStatus: order.orderStatus || 'pending',
    paymentStatus: order.paymentStatus || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
    syncedAt: new Date().toISOString(),
  };
}

async function restFetch(path, options = {}) {
  const response = await fetch(`${DB_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) throw new Error(`Firebase REST error: ${response.status}`);
  return response.json();
}

export async function saveCloudOrder(order, retries = 3) {
  const payload = buildPayload(order);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await restFetch(`/orders/${order.orderId}.json`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return payload;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  return payload;
}

export async function fetchCloudOrders() {
  const data = await restFetch('/orders.json');
  if (!data) return [];

  const orders = Object.values(data).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  return normalizeOfflineOrders(orders);
}

export async function updateCloudOrderStatus(orderId, updates) {
  await restFetch(`/orders/${orderId}.json`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...updates,
      updatedAt: new Date().toISOString(),
    }),
  });
}