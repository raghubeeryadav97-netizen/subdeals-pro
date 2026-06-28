import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';
import { logAction } from '../utils/auditLog.js';

export const getCategories = async (req, res) => {
  const filter = { status: 'active' };
  if (req.query.type) filter.type = req.query.type;
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  res.json({ success: true, categories });
};

export const getCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, status: 'active' });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
};

export const createCategory = async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.name) };
  const category = await Category.create(data);
  await logAction(req, 'create', 'category', category._id);
  res.status(201).json({ success: true, category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  await logAction(req, 'update', 'category', category._id);
  res.json({ success: true, category });
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await logAction(req, 'delete', 'category', req.params.id);
  res.json({ success: true, message: 'Category deleted' });
};

export const getAdminCategories = async (req, res) => {
  const categories = await Category.find().sort({ sortOrder: 1 });
  res.json({ success: true, categories });
};