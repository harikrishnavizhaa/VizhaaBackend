import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userPhone = req.user?.phone_number;

        const user = await prisma.user.findUnique({
            where: { phone: userPhone }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userPhone = req.user?.phone_number;
        const updates = req.body;

        const user = await prisma.user.update({
            where: { phone: userPhone },
            data: updates
        });

        return res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile' });
    }
};
