import { signContractService, requestResignContractService } from '../services/SignatureService.js';
import PublicKey from '../models/Publickey.js';


// Trang ký hợp đồng
export const sendContractPageController = async (req, res, next) => {
    res.render('signatures/send');
}
// Trang xem hợp đồng
export const receiveContractPageController = async (req, res, next) => {
    res.render('signatures/receive');
}

// Ký hợp đồng
export const signContractController = async (req, res, next) => {
    try {
        const contractId = req.params.contractId;
        const userId = req.user.id;
        const privateKey = req.file.path;

        //Tìm public key của user
        const publicKeyObject = await PublicKey.findOne({ userId: userId, status: 'active' });

        if (!publicKeyObject) {
            throw new Error('Khóa công khai không tồn tại');
        }
        const publicKeyId = publicKeyObject._id;
        await signContractService(
            contractId,
            userId,
            privateKey,
            publicKeyId
        );
        res.redirect('/contracts/user');
    } catch (error) {
        next(error);
    }
}

// Yêu cầu ký lại hợp đồng
export const requestResignContractController = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await requestResignContractService(userId);
        res.status(200).json({ message: 'Yêu cầu ký lại hợp đồng đã được gửi đi.' });
    } catch (error) {
        next(error);
    }
}

