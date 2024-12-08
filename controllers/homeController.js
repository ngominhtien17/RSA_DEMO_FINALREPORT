import { verifyToken } from '../services/AuthService.js';
import { findUserById } from '../services/UserService.js';
export const getHome = async (req, res) => {
    //Lấy user từ session
    const token = req.cookies?.token;
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }
    const userObject = await findUserById(req.user.id);
    res.render('index', { user: userObject });
}

