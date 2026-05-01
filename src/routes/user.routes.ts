import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
