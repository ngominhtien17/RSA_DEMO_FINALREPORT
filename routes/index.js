import express from 'express';
import userRoutes from './userRoutes.js';
import contractRoutes from './contractRoutes.js';
import authRoutes from './authRoutes.js';
import homeRoutes from './homeRoutes.js';
import signRoutes from './signRoutes.js';
const router = express.Router();

// Tích hợp tất cả các routes
router.use('/', homeRoutes);
router.use('/users', userRoutes);        // Route user
router.use('/contracts', contractRoutes); // Route hợp đồng
router.use('/auth', authRoutes); // Route đăng ký và đăng nhập
router.use('/signatures', signRoutes); // Route ký hợp đồng
export default router;
