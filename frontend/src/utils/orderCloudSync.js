const DB_URL = 'https://subdeals-696aa-default-rtdb.firebaseio.com';

export async function forceSyncOrderToCloud(order, retries = 5) {
  const payload = {
    ...order,
    _id: order._id || order.orderId,
    orderStatus: order.orderStatus || 'pending',
    paymentStatus: order.paymentStatus || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
    syncedAt: new Date().toISOString(),
  };

  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${DB_URL}/orders/${order.orderId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!response.ok) throw new Error(`Cloud sync failed (${response.status})`);
      return { synced: true, order: payload };
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }

  return { synced: false, error: lastError?.message || 'Cloud sync failed', order: payload };
}