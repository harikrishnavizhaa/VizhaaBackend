import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { generateOTP } from "./otp.service";
import { sendEmail } from "../../utils/email";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const sendOtp = async (req: Request, res: Response): Promise<unknown> => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();

  // Save in DB
  await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    },
  });

  await sendEmail(
    email,
    "Your OTP Code",
    `<h2>Your OTP is: ${otp}</h2>`
  );

  return res.json({ message: "OTP sent" });
};

export const verifyOtp = async (req: Request, res: Response): Promise<unknown> => {
  const { email, otp } = req.body;

  const record = await prisma.otp.findFirst({
    where: { email, otp },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > record.expiresAt) {
    return res.status(400).json({ message: "OTP expired" });
  }

  await prisma.otp.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return res.json({ message: "OTP verified" });
};

export const register = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Check if the email was verified
    const latestOtp = await prisma.otp.findFirst({
      where: { email, verified: true },
      orderBy: { createdAt: "desc" }
    });

    if (!latestOtp) {
      return res.status(400).json({ message: "Email not verified. Please verify OTP first." });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or phone" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        name,
        role: role || 'ORGANIZER',
        status: 'ACTIVE'
      }
    });

    return res.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<unknown> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({ message: "User not found or invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        deviceId: uuidv4(),
      },
    });

    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<unknown> => {
  const { refreshToken } = req.body;

  const session = await prisma.session.findUnique({
    where: { token: refreshToken },
  });

  if (!session) {
    return res.status(403).json({ message: "Invalid token" });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Expired token" });
  }
};

export const logout = async (req: Request, res: Response): Promise<unknown> => {
  const { refreshToken } = req.body;

  await prisma.session.deleteMany({
    where: { token: refreshToken },
  });

  return res.json({ message: "Logged out" });
};
