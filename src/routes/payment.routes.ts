import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

export default router;
