import { generateKeyPair, createUser, findUserByEmail, validatePassword } from '../services/UserService.js';
import { generateToken, verifyToken } from '../services/AuthService.js';

// Trang đăng ký người dùng
export const getRegister = (req, res) => {
    res.render('users/register');
};
// Trang đăng nhập người dùng
export const getLogin = (req, res) => {
    res.render('users/login');
};

// Trang chúc mừng đăng ký thành công
export const getSuccessPage = (req, res) => {
    const { privateKey } = req.query;
    res.render('users/success', { privateKey });
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
        const { user, privateKey, publicKey } = await createUser({ 
            name, 
            email, 
            password,
            role 
        });

        // Loại bỏ password trước khi gửi response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Chuyển hướng đến trang chúc mừng
        res.redirect(`/users/success?privateKey=${encodeURIComponent(privateKey)}&publicKey=${encodeURIComponent(publicKey)}`);
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
            maxAge: 24 * 60 * 60 * 1000,
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
