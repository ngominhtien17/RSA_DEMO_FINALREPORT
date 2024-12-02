import { signContract, verifySignature } from '../services/SignatureService.js';

// Trang ký hợp đồng
export const sendContractPageController = async (req, res, next) => {
    res.render('signatures/send');
}
// Trang xem hợp đồng
export const receiveContractPageController = async (req, res, next) => {
    res.render('signatures/receive');
}
//
export const signContractController = async (req, res, next) => {
    try {
        const { signatureData } = req.body;
        await signContract(
            req.params.contractId,
            req.user.id,
            signatureData
        );
        res.json({ message: 'Ký hợp đồng thành công' });
    } catch (error) {
        next(error);
    }
}

// Xác thực hợp đồng
export const verifySignatureController = async (req, res, next) => {
    try {
        const isValid = await verifySignature(
            req.params.contractId,
            req.user.id
        );
        res.json({ isValid });
    } catch (error) {
        next(error);
    }
}

