import express from 'express';
import userRoutes from './userRoutes.js';
import contractRoutes from './contractRoutes.js';
import authRoutes from './authRoutes.js';
import isAuthenticated from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';
import homeRoutes from './homeRoutes.js';
import signRoutes from './signRoutes.js';
const router = express.Router();

// Tích hợp tất cả các routes
router.use('/', homeRoutes);
router.use('/users', userRoutes);        // Route user
router.use('/contracts', isAuthenticated, contractRoutes); // Route hợp đồng
router.use('/auth', authRoutes); // Route đăng ký và đăng nhập
router.use('/signatures', isAuthenticated, signRoutes); // Route ký hợp đồng
export default router;
