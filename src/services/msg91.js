const axios = require('axios');

const sendOtp = async (mobile) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  
  console.log('Sending Flow OTP =>', otp);

  const response = await axios.post(
    "https://control.msg91.com/api/v5/flow/",
    {
      template_id: process.env.MSG91_TEMPLATE_ID,
      sender: process.env.MSG91_SENDER_ID || 'VIZHAA',
      short_url: "0",
      mobiles: `91${mobile}`,
      OTP: otp,
    },
    {
      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return { otp: otp.toString(), data: response.data };
};

// We will handle verification via our own DB now
const verifyOtp = async (mobile, otp) => {
  return true; 
};

const resendOtp = async (mobile) => {
  return await sendOtp(mobile);
};

module.exports = { sendOtp, verifyOtp, resendOtp };
