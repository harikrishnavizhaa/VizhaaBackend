require('dotenv').config();
const axios = require('axios');

async function sendOTP() {
  try {
    console.log('Sending OTP via MSG91...');
    console.log('Template:', process.env.MSG91_TEMPLATE_ID);
    
    const response = await axios.post(
      'https://control.msg91.com/api/v5/otp',
      {
        mobile: '917339509611',
        template_id: process.env.MSG91_TEMPLATE_ID,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('\n✅ SUCCESS:', response.data);

  } catch (error) {
    console.log(
      '\n❌ ERROR:',
      error.response?.data || error.message
    );
  }
}

sendOTP();
