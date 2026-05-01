import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import { sendEmail } from './utils/email';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Basic Health Check Route
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Vizhaa Backend API is running safely 🚀',
        timestamp: new Date().toISOString(),
    });
});

// Test Email Route
app.get('/test-email', async (_req: Request, res: Response) => {
  await sendEmail(
    "your-email@gmail.com",
    "Test Email",
    "<h1>Hello from Vizhaa 🚀</h1>"
  );
  res.send("Email sent");
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

// Start Server
app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});
