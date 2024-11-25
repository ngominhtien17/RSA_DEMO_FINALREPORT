import express from 'express';
import { signContract, verifyContract } from '../controllers/contractController.js';

const router = express.Router();

// Endpoint ký hợp đồng
router.post('/sign', signContract);

// Endpoint xác thực hợp đồng
router.post('/verify', verifyContract);

export default router;
