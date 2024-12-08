import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    } catch (error) {
        console.error('Token không hợp lệ ở AuthService:', error.message);
        return null;
    }
}

export const generateToken = (user) => {
    // Tạo payload cho token
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        publicKey: user.publicKey,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
        keyResetRequest: user.keyResetRequest
    };

    // Tạo token với secret key và thời gian hết hạn
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token có hiệu lực trong 1 ngày
    });

    return token;
}