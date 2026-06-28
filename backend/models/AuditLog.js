import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: String,
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });

export default mongoose.model('AuditLog', auditLogSchema);