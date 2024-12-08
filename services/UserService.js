import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PublicKey from '../models/Publickey.js';
import { generateTemporaryToken } from '../middlewares/authMiddleware.js';
import { sendEmailKeyReset } from './emailService.js';

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
            role
        });
        
        // Tạo public key, nhưng chưa lưu vào cơ sở dữ liệu
        const publicKeyObject = new PublicKey({
            publicKey: publicKey.trim(),
            userId: user._id // Sử dụng user._id, Mongoose sẽ tự động tạo ObjectId
        });

        // Lưu cả user và publicKeyObject đồng thời
        await Promise.all([user.save(), publicKeyObject.save()]);

        // Cập nhật user với publicKeyObject._id sau khi cả hai đã được lưu
        user.publicKey = publicKeyObject._id;
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
export const findUserById = async (userId) => {
    try {
        return await User.findById(userId);
    } catch (error) {
        throw new Error(`Lỗi khi tìm user: ${error.message}`);
    }
}

export const findAllUsers = async () => {
    try {
        // Tìm tất cả người dùng mà role không phải là 'admin'
        return await User.find({ role: { $ne: 'admin' } });
    } catch (error) {
        throw new Error(`Lỗi khi tìm tất cả người dùng: ${error.message}`);
    }
}

export const updateUserKeyResetRequest = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, { $set: { 'keyResetRequest.requested': true, 'keyResetRequest.requestedAt': new Date() } });
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw new Error(`Lỗi khi cập nhật yêu cầu cấp lại khóa: ${error.message}`);
    }
}
export const getApproveKeyReset = async (userId, publicKey) => {
    try {
        const user = await User.findById(userId);
        console.log('publicKey trước khi update: ', publicKey);
        //Đổi trạng thái khóa công khai cũ thành inactive
        await PublicKey.findByIdAndUpdate(publicKey, { $set: { 'status': 'inactive' } });

        //Tạo key mới
        const { publicKey: newPublicKey, privateKey: newPrivateKey } = await generateKeyPair();
        
        //Cập nhật key mới vào user
        const publicKeyObject = new PublicKey({
            publicKey: newPublicKey.trim(),
            userId: userId
        });
        //Lưu key mới vào database và cập nhật trạng thái yêu cầu cấp lại khóa thành false
        await Promise.all([publicKeyObject.save(), User.findByIdAndUpdate(userId, { $set: { 'keyResetRequest.requested': false, 'publicKey': publicKeyObject._id } })]);
        //Tạo token
        const token = generateTemporaryToken(userId, newPrivateKey);
        //Gửi email
        await sendEmailKeyReset(user.email, user.name, token);
    } catch (error) {
        throw new Error(`Lỗi khi duyệt yêu cầu cấp lại khóa: ${error.message}`);
    }
}
