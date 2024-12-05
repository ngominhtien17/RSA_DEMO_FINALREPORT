import express from 'express';
import { sendContractPageController, receiveContractPageController, signContractController } from '../controllers/signatureController.js';
import { upload } from '../uploads/upload.js';

const router = express.Router();

router.get('/send', sendContractPageController);
router.get('/receive', receiveContractPageController);
router.post('/sign/:contractId', upload.single('privateKey'), signContractController);

export default router;