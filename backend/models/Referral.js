import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referred: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rewardAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'credited', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Referral', referralSchema);