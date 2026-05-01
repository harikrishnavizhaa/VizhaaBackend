import { Router } from 'express';
import { getBookings, createBooking } from '../controllers/booking.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();

router.use(verifyToken);

// GET all bookings for the logged-in user (Organizer or Supplier)
router.get('/', getBookings);

// POST: Organizer creates a booking request for their event
router.post('/', authorizeRole(['ORGANIZER']), createBooking);

export default router;
