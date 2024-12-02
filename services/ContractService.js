import Contract from '../models/Contract.js';

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
  const contracts = await Contract.find({ signerIds: userId });
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