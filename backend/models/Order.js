import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerWhatsapp: { type: String, required: true },
    customerCountry: { type: String, default: 'India' },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    planName: { type: String, required: true },
    duration: { type: Number, required: true },
    durationLabel: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['upi', 'qr', 'bank_transfer', 'razorpay', 'stripe', 'manual'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'uploaded', 'approved', 'rejected', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentScreenshot: { type: String, default: '' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    stripePaymentIntentId: String,
    expiryDate: Date,
    renewalDate: Date,
    notes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    invoiceNumber: String,
    tax: { type: Number, default: 0 },
    remindersSent: [{ type: String }],
  },
  { timestamps: true }
);

orderSchema.index({ orderStatus: 1, paymentStatus: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ expiryDate: 1 });

export default mongoose.model('Order', orderSchema);