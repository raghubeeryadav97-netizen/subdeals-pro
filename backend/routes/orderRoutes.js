import express from 'express';
import { createOrder, uploadPaymentScreenshot, getMyOrders, getOrder, updateOrderStatus, getAdminOrders, downloadInvoice, emailInvoice, bulkUpdateOrders } from '../controllers/orderController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload, setUploadFolder } from '../middleware/upload.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/track/:orderId', getOrder);
router.post('/:id/payment-screenshot', setUploadFolder('payments'), upload.single('screenshot'), uploadPaymentScreenshot);
router.get('/admin/all', protect, authorize('admin', 'manager', 'staff'), getAdminOrders);
router.put('/:id/status', protect, authorize('admin', 'manager'), updateOrderStatus);
router.post('/bulk-update', protect, authorize('admin', 'manager'), bulkUpdateOrders);
router.get('/:id/invoice', protect, downloadInvoice);
router.post('/:id/email-invoice', protect, authorize('admin', 'manager'), emailInvoice);

export default router;