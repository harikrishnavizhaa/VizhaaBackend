const authService = require('./auth.service');

const validatePhone = (phone) => /^\d{10}$/.test(phone);

class AuthController {
  async sendOtp(req, res) {
    console.log(`\n[API REQUEST] => POST /api/auth/send-otp`, req.body);
    const { mobile } = req.body;
    console.log('Mobile:', mobile);

    if (!mobile || !validatePhone(mobile)) {
      console.log(`[API RESPONSE] <= 400 /api/auth/send-otp`, { message: 'Invalid mobile number. Must be 10 digits.' });
      return res.status(400).json({ message: 'Invalid mobile number. Must be 10 digits.' });
    }

    try {
      const result = await authService.sendOtp(mobile);
      console.log(`[API RESPONSE] <= 200 /api/auth/send-otp`, { success: true, message: 'OTP sent successfully' });
      return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.log(`[API RESPONSE] <= 500 /api/auth/send-otp`, { message: err.message });
      return res.status(500).json({ message: 'Server error', details: err.message });
    }
  }

  async verifyOtp(req, res) {
    console.log(`\n[API REQUEST] => POST /api/auth/verify-otp`, req.body);
    const { mobile, otp } = req.body;

    if (!mobile || !validatePhone(mobile)) {
      console.log(`[API RESPONSE] <= 400 /api/auth/verify-otp`, { message: 'Invalid mobile number.' });
      return res.status(400).json({ message: 'Invalid mobile number.' });
    }
    if (!otp || !/^\d{4}$/.test(otp)) {
      console.log(`[API RESPONSE] <= 400 /api/auth/verify-otp`, { message: 'Invalid OTP. Must be 4 digits.' });
      return res.status(400).json({ message: 'Invalid OTP. Must be 4 digits.' });
    }

    try {
      const result = await authService.verifyOtp(mobile, otp);
      console.log(`[API RESPONSE] <= 200 /api/auth/verify-otp`, { success: true, user: result.user.id });
      return res.json({
        success: true,
        message: 'OTP verified successfully',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user
      });
    } catch (err) {
      console.log(`[API RESPONSE] <= 400 /api/auth/verify-otp`, { message: err.message });
      return res.status(400).json({ message: err.message || 'OTP verification failed' });
    }
  }
}

module.exports = new AuthController();
