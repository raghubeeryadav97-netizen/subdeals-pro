import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);