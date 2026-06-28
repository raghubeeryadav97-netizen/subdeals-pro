import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { getSettings } from './settingsService.js';

export const generateInvoicePDF = async (order) => {
  const settings = await getSettings();
  const company = settings.company || {};

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const invoiceNum = order.invoiceNumber || order.orderId;

      doc.fontSize(24).fillColor('#7c3aed').text(company.name || 'SubDeals Pro', 50, 50);
      doc.fontSize(10).fillColor('#666').text(company.address || '', 50, 80);
      doc.text(`GST: ${company.gst || 'N/A'} | Phone: ${company.phone || ''}`, 50, 95);

      doc.fontSize(20).fillColor('#000').text('INVOICE', 400, 50, { align: 'right' });
      doc.fontSize(10).text(`Invoice #: ${invoiceNum}`, 400, 80, { align: 'right' });
      doc.text(`Order ID: ${order.orderId}`, 400, 95, { align: 'right' });
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 110, { align: 'right' });

      doc.moveTo(50, 130).lineTo(550, 130).stroke('#ddd');

      doc.fontSize(12).fillColor('#000').text('Bill To:', 50, 145);
      doc.fontSize(10).text(order.customerName, 50, 165);
      doc.text(order.customerEmail, 50, 180);
      doc.text(order.customerWhatsapp, 50, 195);
      doc.text(order.customerCountry, 50, 210);

      const tableTop = 250;
      doc.fontSize(10).fillColor('#fff');
      doc.rect(50, tableTop, 500, 25).fill('#7c3aed');
      doc.fillColor('#fff').text('Description', 60, tableTop + 8);
      doc.text('Duration', 280, tableTop + 8);
      doc.text('Amount', 450, tableTop + 8);

      doc.fillColor('#000');
      const rowY = tableTop + 35;
      doc.text(order.planName, 60, rowY);
      doc.text(order.durationLabel, 280, rowY);
      doc.text(`₹${order.finalPrice}`, 450, rowY);

      if (order.discountAmount > 0) {
        doc.text(`Discount (${order.couponCode})`, 60, rowY + 20);
        doc.text(`-₹${order.discountAmount}`, 450, rowY + 20);
      }

      const tax = order.tax || 0;
      if (tax > 0) {
        doc.text('Tax', 60, rowY + 40);
        doc.text(`₹${tax}`, 450, rowY + 40);
      }

      doc.fontSize(12).text('Total:', 380, rowY + 70);
      doc.text(`₹${order.finalPrice}`, 450, rowY + 70);

      const qrData = `Order:${order.orderId}|Amount:${order.finalPrice}|Date:${order.createdAt}`;
      const qrBuffer = await QRCode.toBuffer(qrData, { width: 100 });
      doc.image(qrBuffer, 50, rowY + 100, { width: 80 });

      doc.fontSize(8).fillColor('#999').text('Thank you for your purchase!', 50, 750, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};