import { z } from 'zod';

// User validation schemas
export const registerUserSchema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email().optional(),
    role: z.enum(['ORGANIZER', 'SUPPLIER']),
    organizerType: z.string().optional(),
    services: z.array(z.string()).optional(),
    transportType: z.string().optional(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    organizerType: z.string().optional(),
    services: z.array(z.string()).optional(),
    transportType: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
});

export const updateLocationSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
});

// Event validation schemas
export const createEventSchema = z.object({
    name: z.string().min(3, 'Event name must be at least 3 characters'),
    description: z.string().optional(),
    eventType: z.string(),
    date: z.string().datetime(),
    startTime: z.string(),
    endTime: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    services: z.array(z.string()).min(1, 'At least one service is required'),
    dressCode: z.string().optional(),
    numberOfPeople: z.number().int().positive().optional(),
    specialInstructions: z.string().optional(),
    totalAmount: z.number().positive('Total amount must be positive'),
});

export const updateEventSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    eventType: z.string().optional(),
    date: z.string().datetime().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    services: z.array(z.string()).optional(),
    dressCode: z.string().optional(),
    numberOfPeople: z.number().int().positive().optional(),
    specialInstructions: z.string().optional(),
});

// Booking validation schemas
export const acceptBookingSchema = z.object({
    eventId: z.string().uuid(),
});

export const markAttendanceSchema = z.object({
    arrivedAt: z.string().datetime().optional(),
});

// Payment validation schemas
export const createPaymentOrderSchema = z.object({
    eventId: z.string().uuid(),
    amount: z.number().positive(),
    type: z.enum(['ADVANCE', 'FINAL']),
});

export const verifyPaymentSchema = z.object({
    razorpayOrderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpaySignature: z.string(),
});

// Wallet validation schemas
export const withdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    bankName: z.string().min(2),
    accountNumber: z.string().min(8),
    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
    accountHolderName: z.string().min(2),
});

// Notification validation schemas
export const registerFcmTokenSchema = z.object({
    fcmToken: z.string().min(1),
});
