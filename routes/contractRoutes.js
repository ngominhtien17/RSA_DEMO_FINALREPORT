import express from 'express';
import { signContract, verifyContract, getSend, getReceive } from '../controllers/contractController.js';

const router = express.Router();


// Endpoint gửi hợp đồng
router.get('/send', getSend);

// Endpoint nhận hợp đồng
router.get('/receive', getReceive);

// Endpoint ký hợp đồng
router.post('/sign', signContract);

// Endpoint xác thực hợp đồng
router.post('/verify', verifyContract);

export default router;
