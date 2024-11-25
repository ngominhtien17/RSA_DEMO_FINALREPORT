import crypto from 'crypto';
import Contract from '../models/Contract.js';
import User from '../models/User.js';

// Ký hợp đồng
export const signContract = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const signature = crypto.privateEncrypt(user.privateKey, Buffer.from(hash));

        const contract = new Contract({
            sender: user._id,
            content,
            signature: signature.toString('base64'),
            publicKey: user.publicKey,
        });
        await contract.save();

        res.status(201).json({ message: 'Contract signed successfully', contract });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xác thực hợp đồng
export const verifyContract = async (req, res) => {
    try {
        const { contractId } = req.body;
        const contract = await Contract.findById(contractId).populate('sender');
        if (!contract) return res.status(404).json({ message: 'Contract not found' });

        const hash = crypto.createHash('sha256').update(contract.content).digest('hex');
        const decryptedHash = crypto.publicDecrypt(
            contract.publicKey,
            Buffer.from(contract.signature, 'base64')
        ).toString('utf-8');

        const isValid = hash === decryptedHash;
        contract.status = isValid ? 'Verified' : 'Invalid';
        await contract.save();

        res.status(200).json({ message: 'Contract verified', isValid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
