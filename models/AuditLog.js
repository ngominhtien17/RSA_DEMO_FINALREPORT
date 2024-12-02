import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
});

export default mongoose.model('AuditLog', AuditLogSchema);