import { Request, Response } from 'express';

export const createOrder = async (_req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented' });
};

export const verifyPayment = async (_req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented' });
};
