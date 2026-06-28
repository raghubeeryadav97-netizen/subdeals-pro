import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    type: { type: String, enum: ['entertainment', 'ai', 'other'], default: 'other' },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

categorySchema.index({ type: 1, status: 1 });

export default mongoose.model('Category', categorySchema);