import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createEvent = async (req: AuthRequest, res: Response) => {
    try {
        const {
            name, eventType, date, startTime, endTime,
            latitude, longitude, address, city, state, pincode,
            services, dressCode, totalAmount, advanceAmount, advance
        } = req.body;

        const userPhone = req.user?.phone_number;
        const organizer = await prisma.user.findUnique({ where: { phone: userPhone } });

        if (!organizer) return res.status(404).json({ message: 'Organizer not found' });

        // Use 'advance' if 'advanceAmount' is missing (frontend compatibility)
        const finalAdvance = advanceAmount || advance || 0;

        const event = await prisma.event.create({
            data: {
                organizerId: organizer.id,
                name: name || 'Untitled Event',
                eventType: eventType || 'General',
                date: new Date(date || Date.now()),
                startTime: startTime || '09:00',
                endTime: endTime || '18:00',
                latitude: parseFloat(latitude || 0),
                longitude: parseFloat(longitude || 0),
                address: address || 'No Address Provided',
                city: city || 'Unknown',
                state: state || 'Unknown',
                pincode: pincode || '000000',
                services: services || [],
                dressCode: dressCode || 'None',
                totalAmount: parseFloat(totalAmount || 0),
                advanceAmount: parseFloat(finalAdvance),
                remainingAmount: parseFloat(totalAmount || 0) - parseFloat(finalAdvance),
                status: 'ACTIVE'
            }
        });

        return res.status(201).json({ status: 'success', data: event });
    } catch (error) {
        console.error('Create event error:', error);
        return res.status(500).json({ message: 'Error creating event' });
    }
};

export const getEvents = async (_req: AuthRequest, res: Response) => {
    try {
        const events = await prisma.event.findMany({
            include: { organizer: true }
        });
        return res.status(200).json({ status: 'success', data: events });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching events' });
    }
};
