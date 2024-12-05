import express from 'express';
import { createContractController, getUserContractsController, createContractPage, viewContractController, getContractAdminController, getContractDetailController } from '../controllers/contractController.js';
const router = express.Router();
import { upload } from '../uploads/upload.js';

router.get('/admin-contracts', getContractAdminController);
router.get('/create', createContractPage);
router.post('/create', upload.single('contractFile'), createContractController);
router.get('/user', getUserContractsController);
router.get('/detail/:id', getContractDetailController);
router.get('/:id', viewContractController);

export default router;
