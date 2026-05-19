const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret exists:', !!process.env.RAZORPAY_KEY_SECRET);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

async function run() {
  try {
    console.log('Creating order...');
    const order = await razorpayInstance.orders.create({
      amount: 1999 * 100,
      currency: 'INR',
      receipt: 'test_receipt'
    });
    console.log('Order created successfully:', order);
  } catch (err) {
    console.error('Error creating order:', err);
  }
}

run();
