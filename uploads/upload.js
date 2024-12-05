import multer from 'multer';
import path from 'path';

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/contracts'); // Thư mục lưu trữ file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Khởi tạo multer với cấu hình
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|pem/; // Chấp nhận cả file PDF và PEM
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname) { // Chỉ kiểm tra phần mở rộng
            return cb(null, true);
        } else {
            cb('Error: Chỉ chấp nhận file PDF hoặc PEM!');
        }
    }
});
