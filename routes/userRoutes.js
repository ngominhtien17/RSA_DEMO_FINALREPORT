import express from 'express';
import { login, register, logout, getLogin, getRegister, getSuccessPage, downloadKey, getUserList, getRequestKeyReset, getApproveKeyResetController } from '../controllers/userController.js';
import { isAuthenticated, checkAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', login);
router.get('/register', getRegister);
router.post('/register', register);
router.get('/success', getSuccessPage);
router.get('/logout', logout);
router.get('/download-key', downloadKey);

//Admin
router.get('/list-user', isAuthenticated, checkAdmin, getUserList);
//User
router.post('/request-key-reset/:userId', isAuthenticated, getRequestKeyReset);
//Admin
router.post('/approve-key-reset/:userId', isAuthenticated, checkAdmin, getApproveKeyResetController);
export default router;
