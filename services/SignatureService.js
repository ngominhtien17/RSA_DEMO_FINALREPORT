import Signature from '../models/Signature.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import crypto from 'crypto';

export const signContract = async (contractId, userId, signatureData) => {
    // Kiểm tra xem người dùng có phải là người cần ký không
    const contract = await Contract.findById(contractId);
    if (!contract.signerIds.includes(userId)) {
        throw new Error('Bạn không có quyền ký hợp đồng này');
    }

    // Lưu chữ ký vào database
    const signature = new Signature({
        contractId,
        userId,
        signatureData,
    });

    await signature.save();

    // Kiểm tra nếu tất cả đã ký thì cập nhật trạng thái hợp đồng
    const allSigned = await checkAllSignatures(contractId);
    if (allSigned) {
        contract.status = 'signed';
        await contract.save();
    }
}

export const verifySignature = async (contractId, userId) => {
    const signature = await Signature.findOne({ contractId, userId });
    if (!signature) {
        throw new Error('Chữ ký không tồn tại');
    }

    const contract = await Contract.findById(contractId);
    const user = await User.findById(userId);

    const verify = crypto.createVerify('SHA256');
    verify.update(contract.content);
    verify.end();

    const isValid = verify.verify(user.publicKey, signature.signatureData, 'hex');

    // Cập nhật trạng thái chữ ký
    signature.isValid = isValid;
    await signature.save();

    return isValid;
}

export const checkAllSignatures = async (contractId) => {
    const contract = await Contract.findById(contractId);
    const signatures = await Signature.find({ contractId });
    return signatures.length === contract.signerIds.length;
}