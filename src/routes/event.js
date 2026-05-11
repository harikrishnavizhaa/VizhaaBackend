const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById } = require('../controllers/event');
const authenticate = require('../middleware/authenticate');

// Apply authenticate middleware to all event routes
router.use(authenticate);

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);

module.exports = router;
