import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    photo: { type: String, default: '' },
    images: [{ type: String }],
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    isVerifiedPurchase: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);