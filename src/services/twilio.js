const config = require('../config');
const twilio = require('twilio');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

/**
 * Normalizes phone number to E.164 format
 * @param {string} mobile 
 * @returns {string}
 */
const normalizePhone = (mobile) => {
  // Remove all non-numeric characters except +
  let cleaned = mobile.replace(/[^\d+]/g, '');
  
  // If it starts with +, return as is
  if (cleaned.startsWith('+')) return cleaned;
  
  // If it's a 10-digit Indian number, add +91
  if (cleaned.length === 10) return `+91${cleaned}`;
  
  // If it starts with 91 and is 12 digits, add +
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
  
  // Default fallback
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

const sendOtp = async (mobile) => {
  try {
    const formattedMobile = normalizePhone(mobile);
    console.log(`Sending OTP to: ${formattedMobile}`);
    
    const verification = await client.verify.v2.services(config.twilio.verifyServiceSid)
      .verifications
      .create({ to: formattedMobile, channel: 'sms' });
      
    return { success: true, status: verification.status };
  } catch (error) {
    console.error('Twilio Send OTP Error:', error);
    throw new Error(error.message);
  }
};

const verifyOtp = async (mobile, code) => {
  try {
    const formattedMobile = normalizePhone(mobile);
    console.log(`Checking OTP for: ${formattedMobile}`);

    const verificationCheck = await client.verify.v2
      .services(config.twilio.verifyServiceSid)
      .verificationChecks
      .create({
        to: formattedMobile,
        code,
      });

    console.log("Twilio Verify Response:", verificationCheck);

    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status,
      data: verificationCheck,
    };
  } catch (error) {
    console.error('Twilio Verify OTP Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { sendOtp, verifyOtp };
