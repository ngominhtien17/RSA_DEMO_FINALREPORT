import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  signature: String,
  publicKey: String,
  status: { type: String, default: 'Pending' },
});

export default mongoose.model('Contract', ContractSchema);
