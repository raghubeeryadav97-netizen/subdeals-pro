export function generateOrderId() {
  return `SDP-${Date.now().toString(36).toUpperCase()}`;
}

export function buildWhatsAppUrl(order, adminPhone) {
  const phone = (adminPhone || '916381492284').replace(/\D/g, '');
  const message = encodeURIComponent(
    `Hello,\n\nI want to purchase\nPlan: ${order.planName}\nDuration: ${order.durationLabel}\nPrice: ₹${order.finalPrice}\nCoupon: ${order.couponCode || 'None'}\nName: ${order.customerName}\nWhatsApp: ${order.customerWhatsapp}\nEmail: ${order.customerEmail}\nOrder ID: ${order.orderId}\nPayment: ${order.paymentMethod}\n\nPlease confirm payment.`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

export function saveOfflineOrder(order) {
  const existing = JSON.parse(localStorage.getItem('offlineOrders') || '[]');
  existing.unshift({ ...order, createdAt: new Date().toISOString() });
  localStorage.setItem('offlineOrders', JSON.stringify(existing.slice(0, 50)));
}

export function getOfflineOrders() {
  return JSON.parse(localStorage.getItem('offlineOrders') || '[]');
}