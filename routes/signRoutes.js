import express from 'express';
import { sendContractPageController, receiveContractPageController, signContractController, verifySignatureController } from '../controllers/SignatureController.js';

const router = express.Router();

router.get('/send', sendContractPageController);
router.get('/receive', receiveContractPageController);
router.post('/sign/:contractId', signContractController);
router.post('/verify/:contractId', verifySignatureController);

export default router;