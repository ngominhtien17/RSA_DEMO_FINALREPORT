import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

// Route đăng xuất
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

export default router;
