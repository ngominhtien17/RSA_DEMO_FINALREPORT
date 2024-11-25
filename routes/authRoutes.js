import express from 'express';
import { registerUser, loginUser, getLogin, getRegister } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

// Route đăng xuất
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});

export default router;
