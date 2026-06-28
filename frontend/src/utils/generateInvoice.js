import { jsPDF } from 'jspdf';

export function downloadOrderInvoice(order, settings = {}) {
  const doc = new jsPDF();
  const currency = settings.currency_symbol || '₹';
  const companyName = settings.site_name || settings.company?.name || 'SubDeals Pro';
  const companyPhone = settings.company?.phone || settings.whatsapp_number || '';
  const companyAddress = settings.company?.address || 'Premium Subscriptions Platform';
  const invoiceNumber = order.invoiceNumber || order.orderId;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN')
    : new Date().toLocaleDateString('en-IN');

  doc.setFontSize(22);
  doc.setTextColor(124, 58, 237);
  doc.text(companyName, 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(companyAddress, 14, 28);
  if (companyPhone) doc.text(`Phone: ${companyPhone}`, 14, 34);

  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 150, 20, { align: 'right' });

  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoiceNumber}`, 150, 28, { align: 'right' });
  doc.text(`Order ID: ${order.orderId}`, 150, 34, { align: 'right' });
  doc.text(`Date: ${orderDate}`, 150, 40, { align: 'right' });

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 46, 196, 46);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Bill To:', 14, 56);

  doc.setFontSize(10);
  doc.text(order.customerName || '-', 14, 64);
  doc.text(order.customerEmail || '-', 14, 70);
  doc.text(order.customerWhatsapp || '-', 14, 76);
  doc.text(order.customerCountry || 'India', 14, 82);

  let y = 96;
  doc.setFillColor(124, 58, 237);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 16, y + 7);
  doc.text('Duration', 100, y + 7);
  doc.text('Amount', 165, y + 7);

  y += 18;
  doc.setTextColor(0, 0, 0);
  doc.text(order.planName || '-', 16, y);
  doc.text(order.durationLabel || `${order.duration || '-'} Month`, 100, y);
  doc.text(`${currency}${order.finalPrice ?? 0}`, 165, y);

  if (order.discountAmount > 0) {
    y += 8;
    doc.text(`Discount (${order.couponCode || 'Coupon'})`, 16, y);
    doc.text(`-${currency}${order.discountAmount}`, 165, y);
  }

  y += 14;
  doc.setFontSize(12);
  doc.text('Total:', 140, y);
  doc.text(`${currency}${order.finalPrice ?? 0}`, 165, y);

  y += 12;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Payment Method: ${(order.paymentMethod || 'manual').replace(/_/g, ' ').toUpperCase()}`, 14, y);
  doc.text(`Order Status: ${order.orderStatus || 'pending'}`, 14, y + 6);
  doc.text(`Payment Status: ${order.paymentStatus || 'pending'}`, 14, y + 12);

  doc.setFontSize(9);
  doc.text('Thank you for your purchase!', 105, 285, { align: 'center' });

  doc.save(`invoice-${order.orderId}.pdf`);
}

export function isOfflineOrder(orderOrId) {
  const id = typeof orderOrId === 'string' ? orderOrId : orderOrId?._id || orderOrId?.orderId;
  return String(id || '').startsWith('SDP-') || String(id || '').startsWith('offline-');
}