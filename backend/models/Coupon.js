import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    expiryDate: Date,
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    isSingleUse: { type: Boolean, default: false },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    plans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);