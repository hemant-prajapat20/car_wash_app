import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRazorpayOrder } from '../src/controllers/paymentController';

dotenv.config();

const mockReq = {
  body: {
    amount: 1999,
    receipt: 'plan_6a0c019a3378e28d051b1c2b'
  }
} as any;

const mockRes = {
  status(code: number) {
    console.log('Status set to:', code);
    return this;
  },
  json(data: any) {
    console.log('JSON response:', JSON.stringify(data, null, 2));
    return this;
  }
} as any;

async function test() {
  try {
    console.log('Testing createRazorpayOrder controller directly...');
    await createRazorpayOrder(mockReq, mockRes, () => {});
  } catch (err) {
    console.error('Error running controller:', err);
  }
}

test();
