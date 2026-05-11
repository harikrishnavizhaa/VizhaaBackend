const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/payment');
const authenticate = require('../middleware/authenticate');

// Apply authentication middleware to secure payment routes
router.use(authenticate);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
