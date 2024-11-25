import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Hàm kết nối cơ sở dữ liệu
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rsa-demo');

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Dừng ứng dụng nếu không kết nối được DB
    }
};

export default connectDB;
