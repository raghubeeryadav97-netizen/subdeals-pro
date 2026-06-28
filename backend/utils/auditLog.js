import AuditLog from '../models/AuditLog.js';

export const logAction = async (req, action, resource, resourceId = null, details = {}) => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      action,
      resource,
      resourceId,
      details,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch {
    // Silent fail for audit logging
  }
};