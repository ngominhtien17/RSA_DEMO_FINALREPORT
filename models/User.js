import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  publicKey: { type: mongoose.Schema.Types.ObjectId, ref: 'PublicKey' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  keyResetRequest: {
    requested: { type: Boolean, default: false },
    requestedAt: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
