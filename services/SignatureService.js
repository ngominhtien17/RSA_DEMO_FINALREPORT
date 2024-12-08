import Signature from '../models/Signature.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { sendEmailRequestResign } from './emailService.js';
import PublicKey from '../models/Publickey.js';

export const signContractService = async (contractId, userId, privateKey, publicKeyId) => {
    // Kiểm tra xem hợp đồng có tồn tại không
    const contract = await Contract.findById(contractId);
    if (!contract) {
        fs.unlinkSync(privateKey, (err) => {
            if (err) {
                console.error('Lỗi khi xóa tệp private key:', err);
            }
        });
        throw new Error('Hợp đồng không tồn tại');
    }

    // Kiểm tra xem người dùng có phải là người cần ký không
    if (!contract.signerIds.includes(userId)) {
        fs.unlinkSync(privateKey, (err) => {
            if (err) {
                console.error('Lỗi khi xóa tệp private key:', err);
            }
        });
        throw new Error('Bạn không có quyền ký hợp đồng này');
    }

    // Tạo đường dẫn tới tệp hợp đồng
    const contractFilePath = path.join(process.cwd(), 'public', contract.contractFilePath);

    // Đọc private key
    const privateKeyContent = fs.readFileSync(privateKey, 'utf8');

    // Tạo chữ ký
    const sign = crypto.createSign('SHA256');
    sign.update(contractFilePath);
    sign.end();
    const signature = sign.sign(privateKeyContent);

    // Tìm chữ ký hiện có của người dùng cho hợp đồng này
    let existingSignature = await Signature.findOne({ contractId, userId });

    if (existingSignature) {
        // Cập nhật chữ ký hiện có
        existingSignature.signatureData = signature;
    } else {
        // Tạo chữ ký mới nếu chưa có
        existingSignature = new Signature({
            contractId,
            userId,
            publicKeyId,
            signatureData: signature,
        });
        contract.signatures.push(existingSignature._id);
    }

    // Lưu chữ ký vào database
    await existingSignature.save();
    await contract.save();

    // Xóa tệp private key
    fs.unlinkSync(privateKey, (err) => {
        if (err) {
            console.error('Lỗi khi xóa tệp private key:', err);
        }
    });

    // Xác minh chữ ký
    const isValid = await verifySignature(contractId, userId, contractFilePath, signature);
    existingSignature.isValid = isValid;
    await existingSignature.save();

    // Kiểm tra nếu tất cả đã ký thì cập nhật trạng thái hợp đồng
    const allSigned = await checkAllSignatures(contractId);
    if (allSigned) {
        contract.status = 'completed';
        await contract.save();
    }
}

export const verifySignature = async (contractId, userId, contractFilePath, signature) => {
    // Lấy hợp đồng và người ký    
    const contract = await Contract.findById(contractId).populate('signatures', 'signatureData userId ');
    //Tìm chữ ký tương ứng
    const signatureRecord = contract.signatures.find(signature => signature.userId.toString() === userId.toString());

    if (!signatureRecord) {
        throw new Error('Chữ ký không tồn tại');
    }
    const idSignature = signatureRecord._id;

    const signatureObject = await Signature.findById(idSignature);
    const publicKeyId = signatureObject.publicKeyId;
    const publicKeyObject = await PublicKey.findById(publicKeyId);

    //Xác minh chữ ký
    const verifier = crypto.createVerify('SHA256');
    verifier.update(contractFilePath);
    verifier.end();
    const isValid = verifier.verify(publicKeyObject.publicKey, signature);

    //Cập nhật trạng thái chữ ký
    signatureRecord.isValid = isValid;
    await signatureRecord.save();

    return isValid;
}

export const checkAllSignatures = async (contractId) => {
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new Error('Hợp đồng không tồn tại');
    }

    // Lấy tất cả chữ ký hợp lệ cho hợp đồng
    const validSignatures = await Signature.find({ contractId, isValid: true });

    // Kiểm tra xem tất cả người ký đã ký hợp lệ chưa
    const allSigned = contract.signerIds.every(signerId =>
        validSignatures.some(signature => signature.userId.toString() === signerId.toString())
    );

    return allSigned;
}

export const requestResignContractService = async (userId) => {
    try {
        const user = await User.findById(userId);
        await sendEmailRequestResign(user.email, user.name, userId);
    } catch (error) {
        throw new Error('Lỗi khi gửi email yêu cầu ký lại');
    }
}
