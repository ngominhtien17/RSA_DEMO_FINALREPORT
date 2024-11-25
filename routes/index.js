import express from 'express';
import userRoutes from './userRoutes.js';
import contractRoutes from './contractRoutes.js';
import authRoutes from './authRoutes.js';
import isAuthenticated from '../middlewares/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
// Trang chủ mặc định
router.get('/', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.user = decoded;
        } catch (error) {
            console.error('Token không hợp lệ:', error.message);
        }
    }
    console.log(req.user);
    res.render('index', { user: req.user });
});
// Route không yêu cầu đăng nhập
router.get('/login', (req, res) => {
    const token = req.cookies?.token;
    // Nếu đã có token hợp lệ, chuyển hướng về trang chủ
   if (token) {
       try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
           return res.redirect('/'); // Chuyển hướng về trang chủ nếu đã đăng nhập
       } catch (error) {
           
       }
   }
    res.render('login');
});

// Trang đăng ký
router.get('/register', (req, res) => {
    res.render('register');
});


// Giao diện gửi hợp đồng
router.get('/send', isAuthenticated, (req, res) => {
    console.log(req.user);
    res.render('send', { user: req.user });
});



// Giao diện nhận hợp đồng
router.get('/receive', isAuthenticated, (req, res) => {
    res.render('receive', { user: req.user });
});


// Tích hợp tất cả các routes
router.use('/users', userRoutes);        // Route user
router.use('/contracts', contractRoutes); // Route hợp đồng
router.use('/auth', authRoutes); // Route đăng ký và đăng nhập
export default router;
