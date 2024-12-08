import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.token; // Lấy token từ cookie
    if (!token) {
        req.session.returnTo = req.originalUrl;
        // Nếu không có token, chuyển hướng đến trang đăng nhập
        return res.redirect('/users/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey'); // Giải mã token
        req.user = decoded; // Lưu thông tin người dùng vào req.user
        res.locals.user = decoded; // Lưu thông tin người dùng vào res.locals.user
        next(); // Chuyển tiếp đến route tiếp theo
    } catch (error) {
        console.error('Token không hợp lệ ở middleware:', error.message);
        if (req.path !== '/users/login') {
            return res.redirect('/users/login'); // Chuyển hướng đến trang đăng nhập
        } else {
            res.status(401).send('Unauthorized: Invalid token');
        }
    }
};

const checkAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Truy cập bị từ chối: Không phải admin' });
    }
    next(); // Cho phép tiếp tục nếu là admin
};

export { isAuthenticated, checkAdmin };

export const generateTemporaryToken = (userId,privateKey) => {
    try{
        return jwt.sign({ userId, privateKey }, process.env.JWT_SECRET, { expiresIn: '15m' });
    } catch (error) {
        console.error('Lỗi khi tạo token:', error.message);
        throw new Error('Lỗi khi tạo token');
    }
};
