import express from 'express';
import { getHome } from '../controllers/homeController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', isAuthenticated, getHome);

export default router;