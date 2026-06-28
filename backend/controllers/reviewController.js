import Review from '../models/Review.js';
import Plan from '../models/Plan.js';
import { notifyAdmins } from '../services/notificationService.js';
import { notifyAdminWhatsApp } from '../services/whatsappService.js';

export const getReviews = async (req, res) => {
  const filter = { status: 'approved' };
  if (req.query.plan) filter.plan = req.query.plan;
  const reviews = await Review.find(filter).populate('plan', 'name logo').sort({ createdAt: -1 }).limit(50);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ success: true, reviews, averageRating: Math.round(avg * 10) / 10 });
};

export const submitReview = async (req, res) => {
  const data = { ...req.body, user: req.user?._id };
  if (req.file) {
    const { uploadFile } = await import('../services/uploadService.js');
    data.photo = await uploadFile(req.file.path, 'reviews');
  }
  const review = await Review.create(data);
  await notifyAdmins(req.app.get('io'), { title: 'New Review', message: `${review.name} submitted a review`, type: 'review' });
  await notifyAdminWhatsApp(`New review from ${review.name} - Rating: ${review.rating}/5`);
  res.status(201).json({ success: true, review });
};

export const getAdminReviews = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const reviews = await Review.find(filter).populate('plan', 'name').sort({ createdAt: -1 });
  res.json({ success: true, reviews });
};

export const updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

  if (review.status === 'approved' && review.plan) {
    const planReviews = await Review.find({ plan: review.plan, status: 'approved' });
    const avg = planReviews.reduce((s, r) => s + r.rating, 0) / planReviews.length;
    await Plan.findByIdAndUpdate(review.plan, { averageRating: Math.round(avg * 10) / 10, reviewCount: planReviews.length });
  }
  res.json({ success: true, review });
};

export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
};