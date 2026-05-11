const express = require('express');
const axios = require('axios');

const router = express.Router();

const AUTH_KEY = process.env.MSG91_AUTH_KEY;
const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

const MSG91_BASE = 'https://control.msg91.com/api/v5/otp';

const headers = {
  authkey: AUTH_KEY,
  'content-type': 'application/json',
};

const validatePhone = (phone) => /^\d{10}$/.test(phone);

// POST /api/auth/send-otp
// Body: { phone: "9876543210" }
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
  }

  try {
    const { data } = await axios.post(
      MSG91_BASE,
      {
        template_id: TEMPLATE_ID,
        mobile: `91${phone}`,
        otp_length: 4,
        otp_expiry: 5,
      },
      { headers }
    );

    if (data.type === 'success') {
      return res.json({ success: true, message: 'OTP sent successfully' });
    }

    return res.status(500).json({ message: data.message || 'Failed to send OTP' });
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return res.status(500).json({ message: 'Server error', details: msg });
  }
});

// POST /api/auth/verify-otp
// Body: { phone: "9876543210", otp: "1234" }
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone number.' });
  }
  if (!otp || !/^\d{4}$/.test(otp)) {
    return res.status(400).json({ message: 'Invalid OTP. Must be 4 digits.' });
  }

  try {
    const { data } = await axios.get(`${MSG91_BASE}/verify`, {
      params: { mobile: `91${phone}`, otp },
      headers: { authkey: AUTH_KEY },
    });

    if (data.type === 'success') {
      return res.json({ success: true, message: 'OTP verified successfully' });
    }

    return res.status(400).json({ message: data.message || 'Invalid OTP' });
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return res.status(400).json({ message: msg || 'OTP verification failed' });
  }
});

// POST /api/auth/resend-otp
// Body: { phone: "9876543210" }
router.post('/resend-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone || !validatePhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone number.' });
  }

  try {
    const { data } = await axios.post(
      `${MSG91_BASE}/retry`,
      { mobile: `91${phone}`, retrytype: 'text' },
      { headers }
    );

    if (data.type === 'success') {
      return res.json({ success: true, message: 'OTP resent' });
    }

    return res.status(500).json({ message: data.message || 'Failed to resend OTP' });
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    return res.status(500).json({ message: msg || 'Failed to resend OTP' });
  }
});

module.exports = router;
