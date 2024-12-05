import Signature from '../models/Signature.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const signContractService = async (contractId, userId, privateKey) => {
    // Kiểm tra xem hợp đồng có tồn tại không
    const contract = await Contract.findById(contractId);
    if (!contract) {
        throw new Error('Hợp đồng không tồn tại');
    }

    //Tạo đường dẫn tới tệp hợp đồng
    const contractFilePath = path.join(process.cwd(), 'public', contract.contractFilePath);
    // Kiểm tra xem người dùng có phải là người cần ký không
    if (!contract.signerIds.includes(userId)) {
        throw new Error('Bạn không có quyền ký hợp đồng này');
    }
    
    // Đọc private key
    const privateKeyContent = fs.readFileSync(privateKey, 'utf8');

    // Tạo chữ ký
    const sign = crypto.createSign('SHA256');
    sign.update(contractFilePath);
    sign.end();
    const signature = sign.sign(privateKeyContent);


    // Lưu chữ ký vào database
    const newSignature = new Signature({
        contractId,
        userId,
        signatureData: signature,
    });
    //Lưu chữ ký vào hợp đồng
    contract.signatures.push(newSignature._id);
    await newSignature.save();
    await contract.save();
    //Xóa tệp private key
    fs.unlinkSync(privateKey, (err) => {
        if (err) {
            console.error('Lỗi khi xóa tệp private key:', err);
        }
    });

    // Xác minh chữ ký
    const isValid = await verifySignature(contractId, userId, contractFilePath, signature);
    newSignature.isValid = isValid;
    await newSignature.save();

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
    const user = await User.findById(userId);
    //Tìm chữ ký tương ứng
    const signatureRecord = contract.signatures.find(signature => signature.userId.toString() === userId.toString());

    if (!signatureRecord) {
        throw new Error('Chữ ký không tồn tại');
    }

    //Xác minh chữ ký
    const verifier = crypto.createVerify('SHA256');
    verifier.update(contractFilePath);
    verifier.end();
    const isValid = verifier.verify(user.publicKey, signature);

    //Cập nhật trạng thái chữ ký
    signatureRecord.isValid = isValid;
    await signatureRecord.save();

    return isValid;
}

export const checkAllSignatures = async (contractId) => {
    const contract = await Contract.findById(contractId);
    const signatures = await Signature.find({ contractId });
    return signatures.length === contract.signerIds.length;
}
