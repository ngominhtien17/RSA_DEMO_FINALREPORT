import User from '../models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Sử dụng JWT để xác thực

// Đăng ký người dùng
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Tạo cặp khóa RSA
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        // Lưu người dùng mới
        const newUser = new User({
            name,
            email,
            password, // Mật khẩu sẽ được tự động hash trong schema
            privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
            publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
        });

        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Đăng nhập người dùng
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }

        // Tạo token JWT với thông tin người dùng
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email},
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        // Lưu token vào cookie
        res.cookie('token', token, {
            httpOnly: true, // Cookie chỉ có thể được truy cập trên server
            secure: process.env.NODE_ENV === 'production', // Cookie chỉ hoạt động trên HTTPS khi ở môi trường production
            maxAge: 24 * 60 * 60 * 1000, // Cookie tồn tại trong 1 ngày (tính bằng ms)
            sameSite: 'lax', // Cookie không bị gửi trong yêu cầu cross-site không cần thiết
        });
        
        res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
