const express = require('express');
const ctrl = require('../controllers/organizer');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/profile', authenticate, ctrl.updateProfile);

module.exports = router;
