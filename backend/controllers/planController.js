import Plan from '../models/Plan.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';
import { logAction } from '../utils/auditLog.js';

export const getPlans = async (req, res) => {
  const { type, category, search, featured, popular, trending, minPrice, maxPrice, duration, page = 1, limit = 20 } = req.query;
  const filter = { status: 'active' };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;
  if (popular === 'true') filter.isPopular = true;
  if (trending === 'true') filter.isTrending = true;
  if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

  let plans = await Plan.find(filter).populate('category', 'name slug icon type').sort({ createdAt: -1 });

  if (minPrice || maxPrice || duration) {
    plans = plans.filter((plan) => {
      const pricing = plan.durationPricing.find((d) => !duration || d.months === Number(duration));
      if (!pricing) return false;
      if (minPrice && pricing.offerPrice < Number(minPrice)) return false;
      if (maxPrice && pricing.offerPrice > Number(maxPrice)) return false;
      return true;
    });
  }

  const start = (page - 1) * limit;
  const paginated = plans.slice(start, start + Number(limit));

  res.json({ success: true, count: plans.length, plans: paginated });
};

export const getPlan = async (req, res) => {
  const plan = await Plan.findOne({ slug: req.params.slug, status: 'active' }).populate('category');
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  res.json({ success: true, plan });
};

export const createPlan = async (req, res) => {
  const data = req.body;
  data.slug = slugify(data.name);
  const exists = await Plan.findOne({ slug: data.slug });
  if (exists) data.slug = `${data.slug}-${Date.now()}`;

  const plan = await Plan.create(data);
  await logAction(req, 'create', 'plan', plan._id);
  res.status(201).json({ success: true, plan });
};

export const updatePlan = async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  await logAction(req, 'update', 'plan', plan._id);
  res.json({ success: true, plan });
};

export const deletePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  plan.status = 'archived';
  await plan.save();
  await logAction(req, 'archive', 'plan', plan._id);
  res.json({ success: true, message: 'Plan archived' });
};

export const duplicatePlan = async (req, res) => {
  const original = await Plan.findById(req.params.id).lean();
  if (!original) return res.status(404).json({ success: false, message: 'Plan not found' });
  delete original._id;
  original.name = `${original.name} (Copy)`;
  original.slug = `${original.slug}-copy-${Date.now()}`;
  original.totalSales = 0;
  const plan = await Plan.create(original);
  res.status(201).json({ success: true, plan });
};

export const getAdminPlans = async (req, res) => {
  const { status, type, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const plans = await Plan.find(filter).populate('category').sort({ createdAt: -1 });
  res.json({ success: true, plans });
};