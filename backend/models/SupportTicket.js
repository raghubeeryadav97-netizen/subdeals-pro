import mongoose from 'mongoose';

const ticketReplySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isStaff: { type: Boolean, default: false },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'pending', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    attachments: [{ type: String }],
    replies: [ticketReplySchema],
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', supportTicketSchema);