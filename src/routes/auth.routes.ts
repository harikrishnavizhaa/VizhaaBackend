import { Router } from 'express';
import { register, login, sendOtp, verifyOtp, refresh, logout } from '../modules/auth/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
