import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Sử dụng bcrypt để mã hóa mật khẩu

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Thêm trường mật khẩu
    privateKey: { type: String },
    publicKey: { type: String },
});

// Hash mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('User', UserSchema);
