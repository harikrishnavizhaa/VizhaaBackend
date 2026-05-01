import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userPhone = req.user?.phone_number;
        const user = await prisma.user.findUnique({ where: { phone: userPhone } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        let bookings: any[] = [];

        if (user.role === 'ORGANIZER') {
            // Organizer sees bookings for their events
            bookings = await prisma.booking.findMany({
                where: {
                    event: {
                        organizerId: user.id
                    }
                },
                include: {
                    event: true,
                    supplier: { select: { id: true, name: true, phone: true, services: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else if (user.role === 'SUPPLIER') {
            // Supplier sees their own bookings
            bookings = await prisma.booking.findMany({
                where: { supplierId: user.id },
                include: {
                    event: true,
                    supplier: { select: { id: true, name: true, phone: true, services: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            bookings = [];
        }

        return res.status(200).json({ status: 'success', data: bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Error fetching bookings' });
    }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.body;
        const userPhone = req.user?.phone_number;
        const organizer = await prisma.user.findUnique({ where: { phone: userPhone } });

        if (!organizer) return res.status(404).json({ message: 'Organizer not found' });

        const booking = await prisma.booking.create({
            data: {
                eventId,
                supplierId: organizer.id, // Will be updated when supplier accepts
                status: 'PENDING'
            }
        });

        return res.status(201).json({ status: 'success', data: booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ message: 'Error creating booking' });
    }
};
