import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const generateKeyPair = async () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });
    // Chuyển đổi key sang format string để lưu vào database
    return {
        publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
        privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' })
    };
}

export const createUser = async (userData) => {
    try {
        const { name, email, password, role = 'user' } = userData;
        const { publicKey, privateKey } = await generateKeyPair();
        
        // Hash password trước khi tạo user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
            publicKey,
            role
        });
        
        await user.save();
        
        // Trả về cả user và privateKey
        return { user, privateKey };
    } catch (error) {
        throw new Error(`Lỗi khi tạo user: ${error.message}`);
    }
}

export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error(`Lỗi khi tìm user: ${error.message}`);
    }
}

export const validatePassword = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error(`Lỗi khi xác thực mật khẩu: ${error.message}`);
    }
}
