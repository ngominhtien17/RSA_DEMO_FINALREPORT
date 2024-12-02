import Contract from '../models/Contract.js';
import { createContract, getContractsByUser, getContractById, getUserContracts, updateContractSigningStatus } from '../services/ContractService.js';
import User from '../models/User.js';
//trang tạo hợp đồng
export const createContractPage = (req, res) => {
    res.render('contracts/createContract');
}

// Tạo hợp đồng
export const createContractController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng tải lên file PDF.' });
        }

        // Tìm kiếm ObjectId của người ký dựa trên email
        const signerEmails = req.body.signerEmails.split(',').map(email => email.trim());
        const signerIds = await User.find({ email: { $in: signerEmails } }).select('_id');

        const contractData = {
            title: req.body.title,
            signerEmails,
            signerIds: signerIds.map(user => user._id), // Lưu trữ ObjectId
            creatorId: req.user.id,
            contractFilePath: `uploads/contracts/${req.file.filename}`
        };

        const contract = await createContract(contractData);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}


// Lấy hợp đồng của người dùng
export const getContractsController = async (req, res, next) => {
    try {
        const contracts = await getContractsByUser(req.user.id);
        res.json(contracts);
    } catch (error) {
        next(error);
    }
}

// Lấy hợp đồng theo ID
export const getContractByIdController = async (req, res, next) => {
    try {
        const contract = await getContractById(req.params.contractId);
        res.json(contract);
    } catch (error) {
        next(error);
    }
}


// Lấy danh sách hợp đồng mà người dùng là người ký
export const getUserContractsController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contracts = await getUserContracts(userId);

        const signedContracts = contracts.filter(contract => contract.signedBy && contract.signedBy.includes(userId));
        const pendingContracts = contracts.filter(contract => contract.signedBy && !contract.signedBy.includes(userId));

        res.render('contracts/userContract', {
            contracts,
            totalSigned: signedContracts.length,
            totalPending: pendingContracts.length
        });
    } catch (error) {
        next(error);
    }
};

// Xem chi tiết hợp đồng và hiển thị file PDF
export const viewContractController = async (req, res, next) => {
    try {
        const contract = await getContractById(req.params.id);
        if (!contract) {
            return res.status(404).send('Hợp đồng không tồn tại');
        }
        console.log(contract);
        res.render('contracts/viewContract', { contract });
    } catch (error) {
        next(error);
    }
};

// Ký hoặc từ chối hợp đồng
export const signContractController = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await updateContractSigningStatus(req.params.id, userId, req.body.action);
        res.redirect('/contracts');
    } catch (error) {
        next(error);
    }
};