import express from 'express';
import { createContractController, getUserContractsController, createContractPage, viewContractController } from '../controllers/contractController.js';
const router = express.Router();
import { upload } from '../uploads/upload.js';

router.get('/create', createContractPage);
router.post('/create', upload.single('contractFile'), createContractController);
router.get('/user', getUserContractsController);
router.get('/:id', viewContractController);
export default router;
