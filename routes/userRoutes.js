import express from 'express';
import { generateKeys } from '../controllers/userController.js';

const router = express.Router();

// Endpoint tạo khóa
router.post('/generate-keys', generateKeys);

export default router;
