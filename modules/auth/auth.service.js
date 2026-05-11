const axios = require('axios');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const AUTH_KEY = process.env.MSG91_AUTH_KEY;
const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_BASE = 'https://control.msg91.com/api/v5/otp';

class AuthService {
  async sendOtp(phone) {
    const { data } = await axios.post(
      MSG91_BASE,
      {
        template_id: TEMPLATE_ID,
        mobile: `91${phone}`,
        otp_length: 4,
        otp_expiry: 5,
      },
      {
        headers: {
          authkey: AUTH_KEY,
          'content-type': 'application/json',
        },
      }
    );

    if (data.type !== 'success') {
      throw new Error(data.message || 'Failed to send OTP');
    }
    return data;
  }

  async verifyOtp(phone, otp) {
    const { data } = await axios.get(`${MSG91_BASE}/verify`, {
      params: { mobile: `91${phone}`, otp },
      headers: { authkey: AUTH_KEY },
    });

    if (data.type !== 'success') {
      throw new Error(data.message || 'Invalid OTP');
    }

    // OTP is valid. Find or create user.
    let user = await prisma.user.findUnique({
      where: { mobile: phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { mobile: phone },
      });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  }
}

module.exports = new AuthService();
