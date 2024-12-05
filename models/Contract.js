import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  signerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contractFilePath: { type: String, required: true },
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signature' }],
  status: { type: String, enum: ['pending', 'signed', 'completed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Contract', ContractSchema);
