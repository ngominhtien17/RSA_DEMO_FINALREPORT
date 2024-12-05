import mongoose from 'mongoose';

const SignatureSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signatureData: { type: String, required: true },
  signedAt: { type: Date, default: Date.now },
  isValid: { type: Boolean, default: null },
}, { timestamps: true });

export default mongoose.model('Signature', SignatureSchema);
