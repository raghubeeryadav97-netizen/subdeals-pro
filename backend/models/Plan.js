import mongoose from 'mongoose';

const durationPricingSchema = new mongoose.Schema(
  {
    months: { type: Number, required: true },
    label: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    features: [{ type: String }],
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, enum: ['entertainment', 'ai'], required: true },
    durationPricing: [durationPricingSchema],
    deliveryTime: { type: String, default: 'Instant' },
    status: { type: String, enum: ['active', 'hidden', 'archived'], default: 'active' },
    isTrending: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
    totalSales: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

planSchema.index({ type: 1, status: 1 });
planSchema.index({ isFeatured: 1, isPopular: 1, isTrending: 1 });

export default mongoose.model('Plan', planSchema);