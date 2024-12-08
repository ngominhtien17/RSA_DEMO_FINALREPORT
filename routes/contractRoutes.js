import express from 'express';
import { createContractController, getUserContractsController, createContractPage, viewContractController, getContractAdminController, getContractDetailController, updateContractPage, updateContractController, deleteContract, getUserContractController } from '../controllers/contractController.js';
const router = express.Router();
import { upload } from '../uploads/upload.js';
import { isAuthenticated, checkAdmin } from '../middlewares/authMiddleware.js';

//Xem danh sách hợp đồng
router.get('/admin-contracts', isAuthenticated, checkAdmin, getContractAdminController);
//Trang tạo hợp đồng
router.get('/create', isAuthenticated, checkAdmin, createContractPage);
//Tạo hợp đồng
router.post('/create', isAuthenticated, checkAdmin, upload.single('contractFile'), createContractController);
//Trang cập nhật hợp đồng
router.get('/update/:id', isAuthenticated, checkAdmin, updateContractPage);
//Cập nhật hợp đồng
router.post('/update/:id', isAuthenticated, checkAdmin, upload.single('contractFile'), updateContractController);
//Xem danh sách hợp đồng của user
router.get('/user', isAuthenticated, getUserContractsController);
//Xem chi tiết hợp đồng trang admin
router.get('/detail/:id', isAuthenticated, checkAdmin, getContractDetailController);
//Xem hợp đồng trang user
router.get('/:id', isAuthenticated, viewContractController);
//Xóa hợp đồng
router.post('/delete/:id', isAuthenticated, checkAdmin, deleteContract);
//Xem chi tiết hợp đồng trang user
router.get('/detail-user/:id', isAuthenticated, getUserContractController);
export default router;
