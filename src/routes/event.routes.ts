import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/event.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();

router.use(verifyToken);

// Create event: Only Organizers
router.post('/', authorizeRole(['ORGANIZER']), createEvent);

// Get events: Both can view (might need filtering based on role logic later)
router.get('/', getEvents);

export default router;
