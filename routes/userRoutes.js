import express from 'express';
import { login, register, logout, getLogin, getRegister, getSuccessPage } from '../controllers/userController.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', login);
router.get('/register', getRegister);
router.post('/register', register);
router.get('/success', getSuccessPage);
router.get('/logout', logout);


export default router;
