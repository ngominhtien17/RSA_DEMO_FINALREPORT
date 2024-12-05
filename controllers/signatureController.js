import { signContractService } from '../services/SignatureService.js';



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
        await signContractService(
            contractId,
            userId,
            privateKey
        );
        res.redirect('/contracts/user');
    } catch (error) {
        next(error);
    }
}


