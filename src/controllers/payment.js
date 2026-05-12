const Razorpay = require('razorpay');
const crypto = require('crypto');
const config = require('../config');
const prisma = require('../lib/prisma');

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order', error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventData } = req.body;
  const userId = req.user.sub;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      const event = await prisma.event.create({
        data: {
          userId,
          name: eventData.name,
          type: eventData.type,
          location: eventData.location,
          inDate: eventData.inDate,
          inTime: eventData.inTime,
          outDate: eventData.outDate,
          outTime: eventData.outTime,
          suppliers: parseInt(eventData.suppliers),
          dressCode: eventData.dressCode,
          services: eventData.services,
          costPerHead: parseFloat(eventData.costPerHead),
          totalCost: parseFloat(eventData.totalCost),
          advancePaid: parseFloat(eventData.advancePaid),
          status: 'Upcoming',
          progress: 0
        }
      });

      return res.json({ 
        success: true, 
        message: "Payment verified and event created successfully",
        event 
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Razorpay Verify & Create Error:', error);
    res.status(500).json({ success: false, message: 'Verification or creation failed', error: error.message });
  }
};


module.exports = { createOrder, verifyPayment };
