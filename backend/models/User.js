import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    whatsapp: { type: String, default: '' },
    country: { type: String, default: 'India' },
    role: { type: String, enum: ['admin', 'manager', 'staff', 'customer'], default: 'customer' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
    currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
    planExpiry: Date,
    renewalCount: { type: Number, default: 0 },
    lifetimeSpending: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyLevel: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    referralEarnings: { type: Number, default: 0 },
    internalTags: [String],
    customerLabels: [String],
    manualNotes: [{ note: String, addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);