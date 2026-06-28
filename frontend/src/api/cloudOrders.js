import { ref, set, get, update } from 'firebase/database';
import { database } from '../lib/firebase';
import { normalizeOfflineOrders } from '../utils/offlineOrders';

function ordersRef() {
  return ref(database, 'orders');
}

export async function saveCloudOrder(order) {
  const payload = {
    ...order,
    _id: order._id || order.orderId,
    orderStatus: order.orderStatus || 'pending',
    paymentStatus: order.paymentStatus || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
    syncedAt: new Date().toISOString(),
  };
  await set(ref(database, `orders/${order.orderId}`), payload);
  return payload;
}

export async function fetchCloudOrders() {
  const snapshot = await get(ordersRef());
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  const orders = Object.values(data).sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  return normalizeOfflineOrders(orders);
}

export async function updateCloudOrderStatus(orderId, updates) {
  await update(ref(database, `orders/${orderId}`), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}