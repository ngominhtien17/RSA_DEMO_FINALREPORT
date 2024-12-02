import { verifyToken } from '../services/AuthService.js';

export const getHome = async (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }
    res.render('index', { user: req.user });
}

