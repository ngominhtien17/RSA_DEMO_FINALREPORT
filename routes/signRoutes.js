import express from 'express';
import { sendContractPageController, receiveContractPageController, signContractController, requestResignContractController } from '../controllers/signatureController.js';
import { isAuthenticated, checkAdmin } from '../middlewares/authMiddleware.js';
import { upload } from '../uploads/upload.js';
const router = express.Router();

router.get('/send', isAuthenticated, sendContractPageController);
router.get('/receive', isAuthenticated, receiveContractPageController);
router.post('/sign/:contractId', isAuthenticated, upload.single('privateKey'), signContractController);
router.post('/request-resign/:userId', isAuthenticated, checkAdmin, requestResignContractController);
export default router;