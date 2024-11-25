import jwt from 'jsonwebtoken';
export const getHome = async (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.user = decoded;
        } catch (error) {
            console.error('Token không hợp lệ ở homeController:', error.message);
        }
    }
    res.render('index', { user: req.user });
}

