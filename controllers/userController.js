import crypto from 'crypto';
import User from '../models/User.js';

// Tạo khóa RSA
export const generateKeys = async (req, res) => {
    try {
        const { name, email } = req.body;

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        const user = new User({ name, email, publicKey, privateKey });
        await user.save();

        res.status(201).json({ message: 'Keys generated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
