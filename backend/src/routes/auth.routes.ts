import { Router } from 'express';
import { loginAsGuest, loginWithGoogle, register, login, getMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/guest', loginAsGuest);
router.post('/google', loginWithGoogle);
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

export default router;
