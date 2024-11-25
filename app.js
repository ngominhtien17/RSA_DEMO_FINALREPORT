import express from 'express';
import path from 'path';
import expressHandlebars from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import MongoStore from 'connect-mongo';

dotenv.config();


const app = express();

app.use(cors());
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine('hbs', expressHandlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // Thêm cookie-parser để xử lý cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Sử dụng secure cookie trong production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
    })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware để truyền thông tin người dùng vào view
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Truyền thông tin người dùng vào res.locals
    next();
});
app.use('/', routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
