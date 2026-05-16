import { Request, Response } from 'express';
import { asyncHandler, AuthRequest } from '../middleware/auth';
import { razorpayInstance } from '../config/razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking';

export const createRazorpayOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount) {
    return res.status(400).json({ success: false, message: 'Amount is required' });
  }

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: receipt || `receipt_${Date.now()}`
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    if (!order) return res.status(500).json({ success: false, message: 'Some error occurred while creating order' });

    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export const verifyRazorpayPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  const isDemoSuccess = req.body.isDemo && process.env.NODE_ENV === 'development';

  if (generated_signature === razorpay_signature || isDemoSuccess) {
    // Payment is successful
    try {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'Success';
        booking.transactionId = razorpay_payment_id;
        booking.status = 'Confirmed'; // Auto-confirm on successful payment
        await booking.save();
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating booking' });
    }
  } else {
    // Payment verification failed - DELETE the booking to satisfy "no booking without payment"
    try {
      await Booking.findByIdAndDelete(bookingId);
    } catch (e) {}
    res.status(400).json({ success: false, message: 'Payment verification failed. Booking discarded.' });
  }
});
