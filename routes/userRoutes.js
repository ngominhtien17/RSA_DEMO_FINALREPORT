import express from 'express';
import { generateKeys, updateKeys } from '../controllers/userController.js';

const router = express.Router();

// Endpoint tạo khóa
router.post('/generate-keys', generateKeys);
router.post('/update-keys', updateKeys);
export default router;
