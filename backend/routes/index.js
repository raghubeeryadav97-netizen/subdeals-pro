import express from 'express';
import authRoutes from './authRoutes.js';
import planRoutes from './planRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import couponRoutes from './couponRoutes.js';
import blogRoutes from './blogRoutes.js';
import contactRoutes from './contactRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import supportRoutes from './supportRoutes.js';
import userRoutes from './userRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import seoRoutes from './seoRoutes.js';
import backupRoutes from './backupRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/coupons', couponRoutes);
router.use('/blogs', blogRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/support', supportRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/seo', seoRoutes);
router.use('/backup', backupRoutes);

router.get('/health', (req, res) => res.json({ success: true, message: 'SubDeals Pro API is running' }));

export default router;