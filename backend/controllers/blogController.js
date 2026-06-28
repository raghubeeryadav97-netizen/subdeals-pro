import Blog from '../models/Blog.js';
import { slugify } from '../utils/slugify.js';

export const getBlogs = async (req, res) => {
  const filter = { status: 'published' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  const blogs = await Blog.find(filter).populate('author', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, blogs });
};

export const getBlog = async (req, res) => {
  const blog = await Blog.findOneAndUpdate({ slug: req.params.slug, status: 'published' }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name avatar');
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, blog });
};

export const createBlog = async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.title), author: req.user._id };
  const blog = await Blog.create(data);
  res.status(201).json({ success: true, blog });
};

export const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, blog });
};

export const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Blog deleted' });
};

export const getAdminBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
  res.json({ success: true, blogs });
};