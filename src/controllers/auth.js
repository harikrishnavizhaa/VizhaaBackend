const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const msg91 = require('../services/msg91');
const tokens = require('../services/tokens');

const prisma = new PrismaClient();
const phoneRegex = /^[6-9]\d{9}$/;

const sendOtp = async (req, res) => {
  const mobile = req.body.mobile?.trim();
  if (!mobile || !phoneRegex.test(mobile)) {
    return res.status(400).json({ success: false, message: 'Enter valid mobile number' });
  }
  // TESTING MODE: skip MSG91, just acknowledge
  return res.json({ success: true });
};

const verifyOtp = async (req, res) => {
  try {
    const mobile = req.body.mobile?.trim();

    if (!mobile || !phoneRegex.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    // TESTING MODE: no OTP validation — any input passes
    const existingUser = await prisma.user.findUnique({ where: { mobile } });

    const user = await prisma.user.upsert({
      where: { mobile },
      update: {},
      create: { mobile },
    });

    const accessToken = tokens.generateAccessToken(user.id);
    const refreshToken = await tokens.generateRefreshToken(user.id);

    return res.json({
      success: true,
      isNewUser: !existingUser,
      accessToken,
      refreshToken,
      user: { id: user.id, mobile: user.mobile },
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
    return res.status(400).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  const mobile = req.body.mobile?.trim();
  if (!mobile || !phoneRegex.test(mobile)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid mobile number',
    });
  }
  try {
    await msg91.resendOtp(`91${mobile}`);
    res.json({ success: true });
  } catch (err) {
    res.status(502).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: 'Refresh token required' });
  try {
    const result = await tokens.rotateRefreshToken(refreshToken);
    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: { id: result.user.id, mobile: result.user.mobile },
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await tokens.revokeRefreshToken(refreshToken).catch(() => {});
  res.json({ success: true });
};

module.exports = { sendOtp, verifyOtp, resendOtp, refresh, logout };
