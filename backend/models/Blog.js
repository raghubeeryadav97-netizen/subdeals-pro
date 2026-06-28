import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ slug: 1, status: 1 });

export default mongoose.model('Blog', blogSchema);