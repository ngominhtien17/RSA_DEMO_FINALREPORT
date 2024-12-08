import Contract from '../models/Contract.js';
import Signature from '../models/Signature.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { checkAllSignatures } from './SignatureService.js';

export const createContract = async (data) => {
    const contract = new Contract(data);
    await contract.save();
    return contract;
}

export const getContractsByUser = async (userId) => {
    // Lấy hợp đồng do người dùng tạo hoặc cần ký
    const contracts = await Contract.find({
      $or: [
        { creatorId: userId },
        { signerIds: userId },
      ],
    });
    return contracts;
}

// Lấy chi tiết hợp đồng
export const getContractById = async (contractId) => {
  const contract = await Contract.findById(contractId).populate('signerIds', 'email');
  return contract;
};

// Lấy danh sách hợp đồng mà người dùng là người ký
export const getUserContracts = async (userId) => {
  const contracts = await Contract.find({ signerIds: userId }).populate('signatures', 'userId');
  return contracts;
};

// Cập nhật trạng thái ký của hợp đồng
export const updateContractSigningStatus = async (contractId, userId, action) => {
  const contract = await Contract.findById(contractId);
  if (!contract) {
      throw new Error('Hợp đồng không tồn tại');
  }

  if (action === 'sign') {
      if (!contract.signedBy.includes(userId)) {
          contract.signedBy.push(userId);
      }
  } else if (action === 'decline') {
      contract.signedBy = contract.signedBy.filter(id => id.toString() !== userId);
  }


  await contract.save();
  return contract;
};

// Danh sách hợp đồng admin
export const getContracts = async () => {
  const contracts = await Contract.find();
  return contracts;
}

// Lấy thông tin hợp đồng và chữ ký
export const getContractDetail = async (contractId) => {
  const contract = await Contract.findById(contractId).populate('creatorId', 'email name');
  const signatures = await Signature.find({ contractId }).populate('userId', 'email name');
  if (!contract) {
    throw new Error('Hợp đồng không tồn tại');
  }
  return { contract, signatures };
}

// Cập nhật hợp đồng
export const updateContract = async (contractId, data) => {
  const contract = await Contract.findById(contractId);
  if (!contract) {
    throw new Error('Hợp đồng không tồn tại');
  }

  // Tách chuỗi signerEmails thành mảng
  const emailArray = data.signerEmails.split(',');

  // Tìm các ObjectId của người dùng tương ứng với các email
  const users = await User.find({ email: { $in: emailArray } }).select('_id');
  const signerIds = users.map(user => user._id);

  // Cập nhật contract với signerIds mới
  const updatedContract = await Contract.findByIdAndUpdate(
    contractId,
    { ...data, signerIds },
    { new: true }
  );
  const allSigned = await checkAllSignatures(contractId);
  if (allSigned) {
    updatedContract.status = 'completed';
    await updatedContract.save();
  }
  else {
    updatedContract.status = 'pending';
    await updatedContract.save();
  }
  return updatedContract;
}

// Xóa hợp đồng và các chữ ký liên quan
export const deleteContractService = async (contractId) => {
    // Xóa hợp đồng
    const contract = await Contract.findByIdAndDelete(contractId);
    if (!contract) {
        throw new Error('Hợp đồng không tồn tại');
    }

    // Xóa các chữ ký liên quan
    await Signature.deleteMany({ contractId });
};
