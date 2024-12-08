import { createContract, getContractsByUser, getContractById, getUserContracts, getContractDetail, getContracts, updateContract, deleteContractService } from '../services/ContractService.js';
import User from '../models/User.js';
import Contract from '../models/Contract.js';
import Signature from '../models/Signature.js';

//trang tạo hợp đồng
export const createContractPage = (req, res) => {
    res.render('contracts/createContract', { user: req.user });
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

        if (!contracts || contracts.length === 0) {
            return res.render('contracts/userContract', {
                message: 'Hiện tại bạn chưa có hợp đồng nào.',
                totalSigned: 0,
                totalPending: 0,
                totalWaiting: 0
            });
        }

        const signedContracts = contracts.filter(contract => 
            contract.signatures.some(signature => signature.userId && signature.userId.toString() === userId.toString())
        );

        const waitingContracts = contracts.filter(contract => 
            contract.signerIds.includes(userId) && 
            !contract.signatures.some(signature => signature.userId && signature.userId.toString() === userId.toString())
        );

        // Thêm thông tin về việc người dùng đã ký hay chưa
        const contractsWithSignatureInfo = contracts.map(contract => {
            const hasSigned = contract.signatures.some(signature => signature.userId && signature.userId.toString() === userId.toString());
            return { ...contract.toObject(), hasSigned };
        });

        res.render('contracts/userContract', {
            contracts: contractsWithSignatureInfo,
            totalSigned: signedContracts.length,
            totalPending: contracts.length - signedContracts.length,
            totalWaiting: waitingContracts.length
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
        res.render('contracts/viewContract', { contract });
    } catch (error) {
        next(error);
    }
};

//Danh sách hợp đồng admin
export const getContractAdminController = async (req, res, next) => {
    try {
        const contracts = await getContracts();
        res.render('contracts/viewContractAdmin', { contracts });
    } catch (error) {
        next(error);
    }
}
//Admin
//Chi tiết hợp đồng
export const getContractDetailController = async (req, res, next) => {
    try {
        const contractId = req.params.id;
        const { contract, signatures } = await getContractDetail(contractId);

        res.render('contracts/detailContractAdmin', { contract, signatures });
    } catch (error) {
        next(error);
    }
}

//Trang cập nhật hợp đồng
export const updateContractPage = async (req, res, next) => {
    try {
        const contract = await getContractById(req.params.id);
        const emails = contract.signerIds.map(signer => signer.email);
        res.render('contracts/updateContract', { contract, emails });
    } catch (error) {
        next(error);
    }
}
//Cập nhật hợp đồng
export const updateContractController = async (req, res, next) => {
    try {
        const contractId = req.params.id;
        await updateContract(contractId, req.body);
        res.redirect('/contracts/admin-contracts');
    } catch (error) {
        next(error);
    }
}

export const requestResign = async (req, res) => {
    const { userId } = req.params;
    const { contractId } = req.body;

    try {
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).send('Hợp đồng không tồn tại');
        }

        // Tìm chữ ký của người dùng và cập nhật trạng thái
        const signature = await Signature.findOne({ contractId, userId });
        if (signature) {
            signature.isValid = false; // Đánh dấu chữ ký là không hợp lệ để yêu cầu ký lại
            await signature.save();
        }

        res.status(200).send('Yêu cầu ký lại đã được xử lý');
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra');
    }
};

export const deleteContract = async (req, res) => {
    const { id: contractId } = req.params;

    try {
        await deleteContractService(contractId);
        res.redirect('/contracts/admin-contracts');
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra');
    }
};
