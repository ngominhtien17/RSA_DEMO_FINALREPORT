import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.token; // Lấy token từ cookie
    if (!token) {
        req.session.returnTo = req.originalUrl;
        // Nếu không có token, chuyển hướng đến trang đăng nhập
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey'); // Giải mã token
        req.user = decoded; // Lưu thông tin người dùng vào req.user
        res.locals.user = decoded; // Lưu thông tin người dùng vào res.locals.user
        next(); // Chuyển tiếp đến route tiếp theo
    } catch (error) {
        console.error('Token không hợp lệ ở middleware:', error.message);
        if (req.path !== '/auth/login') {
            return res.redirect('/auth/login'); // Chuyển hướng đến trang đăng nhập
        } else {
            res.status(401).send('Unauthorized: Invalid token');
        }
    }
};

export default isAuthenticated;
