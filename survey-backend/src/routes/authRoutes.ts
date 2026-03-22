import express from 'express';
import { login, me, logout } from '../controllers/authController';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAdmin, me);
router.post('/logout', requireAdmin, logout);

export default router;