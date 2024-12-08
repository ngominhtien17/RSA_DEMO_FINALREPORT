import { generateKeyPair , createUser, findUserByEmail, validatePassword, findUserById, findAllUsers, updateUserKeyResetRequest, getApproveKeyReset} from '../services/UserService.js';
import { generateToken } from '../services/AuthService.js';
import { generateTemporaryToken } from '../middlewares/authMiddleware.js';
import { sendEmailWithLink } from '../services/emailService.js';
import jwt from 'jsonwebtoken';


// Trang đăng ký người dùng
export const getRegister = (req, res) => {
    res.render('users/register', { layout: 'auth' });
};
// Trang đăng nhập người dùng
export const getLogin = (req, res) => {
    res.render('users/login', { layout: 'auth' });
};

// Trang chúc mừng đăng ký thành công
export const getSuccessPage = (req, res) => {
    const { privateKey } = req.query;
    res.render('users/success', { privateKey, layout: 'auth' });
};

// Đăng ký người dùng
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Email đã được sử dụng' 
            });
        }

        // Tạo user mới và lấy privateKey
        const { user, privateKey } = await createUser({ 
            name, 
            email, 
            password,
            role 
        });

        // Loại bỏ password trước khi gửi response
        const userResponse = user.toObject();
        delete userResponse.password;

        //Tạo token
        const token = generateTemporaryToken(user._id.toString(),privateKey);

        // Gửi email với liên kết tải khóa riêng tư
        await sendEmailWithLink(email, token, user.name);

        // Chuyển hướng đến trang chúc mừng
        res.redirect('/users/login');
    } catch (err) {
        res.status(500).json({ 
            error: 'Lỗi khi đăng ký: ' + err.message 
        });
    }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Email không tồn tại' 
            });
        }

        // Kiểm tra password
        const isValidPassword = await validatePassword(
            password, 
            user.password
        );
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Mật khẩu không đúng' 
            });
        }

        // Tạo JWT token
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000,
            sameSite: 'lax',
        });

        // Chuyển đổi đối tượng người dùng và xóa mật khẩu
        const userResponse = user.toObject();
        delete userResponse.password;

        // Trả về thông tin người dùng
        res.redirect('/');

    } catch (err) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({ 
                error: 'Lỗi khi đăng nhập: ' + err.message 
            });
        }
        res.status(500).render('login', { 
            error: 'Lỗi khi đăng nhập: ' + err.message 
        });
    }
};

// Đăng xuất người dùng
export const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/users/login');
};

// Tải khóa riêng tư
export const downloadKey = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findUserById(decoded.userId);
        const privateKey = decoded.privateKey;
        if (!user) {
            return res.status(401).send('Không tìm thấy người dùng');
        }
        res.redirect(`/users/success?privateKey=${encodeURIComponent(privateKey)}`);
    } catch (err) {
        console.error('Lỗi xác thực hoặc tìm kiếm người dùng:', err.message);
        res.status(401).send('Không có quyền truy cập trang tải khóa riêng tư');
    }
};

//Admin
//Danh sách người dùng
export const getUserList = async (req, res) => {
    try{
        const users = await findAllUsers();
        res.render('users/listUser', { users });
    } catch (err) {
        res.status(500).json({ 
            error: 'Lỗi khi lấy danh sách người dùng: ' + err.message 
        });
    }
};

//Admin
//Duyệt yêu cầu cấp lại khóa
export const getApproveKeyResetController = async (req, res) => {
    const userId = req.params.userId;
    const publicKey = req.query.publicKey;
    await getApproveKeyReset(userId, publicKey);
    res.redirect('/users/list-user');
};

//User
//Yêu cầu cấp lại khóa
export const getRequestKeyReset = async (req, res) => {
    const userId = req.params.userId;
    const user = await updateUserKeyResetRequest(userId);
    console.log('user: ', user);
    req.session.user = user;
    res.redirect('/');
};

