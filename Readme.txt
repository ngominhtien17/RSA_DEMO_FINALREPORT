Cấu hình môi trường

Tạo file `.env` và thêm các biến môi trường cần thiết:
PORT='3000'
MONGODB_URI="mongodb+srv://magiccat:hzrxjiKzy6mXHId4@cluster0.lr17g.mongodb.net/contract-RSA?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET=""
SESSION_SECRET=""
NODE_ENV=production
COOKIE_SECRET=""

Chạy ứng dụng

Sử dụng lệnh sau để chạy ứng dụng:
yarn install
yarn start/dev
