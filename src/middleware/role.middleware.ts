import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): unknown => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
    return;
  };
};

export const authorize = authorizeRole;
