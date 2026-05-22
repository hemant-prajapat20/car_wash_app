import { Request, Response } from 'express';
import { asyncHandler, AuthRequest } from '../middleware/auth';
import { razorpayInstance } from '../config/razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking';
import CustomerPlan from '../models/CustomerPlan';
import User from '../models/User';
import ServicePlan from '../models/ServicePlan';

import { createNotification } from './notificationController';

// Reference models to prevent TypeScript tree-shaking
const _registerUser = User.modelName;
const _registerPlan = ServicePlan.modelName;

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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, planId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || (!bookingId && !planId)) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || '';

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  const isDemoSuccess = req.body.isDemo && process.env.NODE_ENV === 'development';

  if (generated_signature === razorpay_signature || isDemoSuccess) {
    try {
      if (bookingId) {
        const booking = await Booking.findById(bookingId).populate('customer vendor');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        // Finalize booking and generate Standardized Transaction & Invoice Metadata
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;
        const txnId = `TXN-${dateStr}-${(booking._id as any).toString().slice(-6).toUpperCase()}`;

        booking.paymentStatus = 'Success'; 
        booking.status = 'Confirmed';
        booking.transactionId = txnId;
        booking.razorpayPaymentId = razorpay_payment_id;
        
        // Generate professional invoice number: INV / YEAR / MONTH / 4-DIGIT-ID
        const invoiceNo = `INV/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${(booking._id as any).toString().slice(-4).toUpperCase()}`;
        
        // Calculate itemized taxes (Assuming 18% total GST: 9% CGST + 9% SGST)
        const subtotal = booking.totalAmount;
        const taxableAmount = parseFloat((subtotal / 1.18).toFixed(2));
        const totalTax = parseFloat((subtotal - taxableAmount).toFixed(2));
        const cgst = parseFloat((totalTax / 2).toFixed(2));
        const sgst = parseFloat((totalTax / 2).toFixed(2));

        await booking.save();

        return res.status(200).json({ 
          success: true, 
          message: 'Payment verified successfully',
          invoiceData: {
            invoiceNo,
            transactionId: razorpay_payment_id,
            date: booking.createdAt,
            subtotal,
            taxableAmount,
            cgst,
            sgst,
            grandTotal: subtotal,
            customer: booking.customer,
            vendor: booking.vendor,
            service: booking.service
          }
        });
      } else if (planId) {
        const customerPlan = await CustomerPlan.findById(planId);
        if (!customerPlan) return res.status(404).json({ success: false, message: 'Plan not found' });
        
        customerPlan.paymentStatus = 'Success';
        customerPlan.status = 'Active';
        customerPlan.purchasedAt = new Date();
        await customerPlan.save();

        // Populate details to construct rich notifications
        await customerPlan.populate('customer vendor servicePlan');
        const planDetails: any = customerPlan.servicePlan;
        const customerDetails: any = customerPlan.customer;
        const vendorDetails: any = customerPlan.vendor;

        // 1. Notify Customer
        await createNotification({
          receiverId: (customerDetails._id as any),
          receiverRole: 'customer',
          title: 'Subscription Activated! 💳',
          message: `Your subscription to "${planDetails.title}" is now active! Services included: ${planDetails.servicesIncluded}.`,
          type: 'payment_success',
          status: 'success',
          bookingId: (customerPlan._id as any).toString()
        });

        // 2. Notify Vendor
        await createNotification({
          receiverId: (vendorDetails._id as any),
          receiverRole: 'vendor',
          title: 'New Plan Purchased',
          message: `Customer "${customerDetails.fullName}" purchased your "${planDetails.title}" subscription plan.`,
          type: 'payment_success',
          status: 'info',
          bookingId: (customerPlan._id as any).toString()
        });
        
        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully for plan',
          data: customerPlan
        });
      } else {
        // No bookingId nor planId – likely vendor registration
        // Return a minimal generic invoice payload
        const invoiceData = {
          invoiceNo: `INV-VEND/${new Date().toISOString().slice(0,10)}`,
          transactionId: razorpay_payment_id,
          date: new Date().toISOString(),
          amount: undefined,
          status: 'Success'
        };
        return res.status(200).json({ success: true, message: 'Payment verified for vendor registration', invoiceData });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ success: false, message: 'Error updating payment status' });
    }
  } else {
    // Payment verification failed - DELETE the booking or plan
    try {
      if (bookingId) {
        await Booking.findByIdAndDelete(bookingId);
      } else if (planId) {
        await CustomerPlan.findByIdAndDelete(planId);
      }
    } catch (e) {}
    res.status(400).json({ success: false, message: 'Payment verification failed. Item discarded.' });
  }
});

export const getInvoiceData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate('customer vendor');
    if (!booking) {
      // Check if it's a CustomerPlan instead
      const plan = await CustomerPlan.findById(bookingId).populate('customer vendor servicePlan');
      if (!plan) return res.status(404).json({ success: false, message: 'Transaction record not found' });

      // Map CustomerPlan to the same invoice shape
      const subtotal = (plan.servicePlan as any)?.price || 0;
      const taxableAmount = parseFloat((subtotal / 1.18).toFixed(2));
      const totalTax = parseFloat((subtotal - taxableAmount).toFixed(2));
      const cgst = parseFloat((totalTax / 2).toFixed(2));
      const sgst = parseFloat((totalTax / 2).toFixed(2));
      
      const date = new Date(plan.purchasedAt || plan.createdAt);
      const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;
      const invoiceNo = `PLN/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${(plan._id as any).toString().slice(-4).toUpperCase()}`;
      const displayTxnId = `TXN-PLN-${dateStr}-${(plan._id as any).toString().slice(-6).toUpperCase()}`;

      return res.json({
        success: true,
        data: {
          invoiceNo,
          transactionId: displayTxnId,
          date: plan.purchasedAt || plan.createdAt,
          subtotal,
          taxableAmount,
          cgst,
          sgst,
          grandTotal: subtotal,
          customer: plan.customer,
          vendor: plan.vendor,
          service: { name: (plan.servicePlan as any)?.title || 'Service Subscription' },
          paymentMode: plan.paymentMode || 'Online'
        }
      });
    }

    // Calculate itemized taxes (Assuming 18% total GST: 9% CGST + 9% SGST)
    const subtotal = booking.totalAmount;
    const taxableAmount = parseFloat((subtotal / 1.18).toFixed(2));
    const totalTax = parseFloat((subtotal - taxableAmount).toFixed(2));
    const cgst = parseFloat((totalTax / 2).toFixed(2));
    const sgst = parseFloat((totalTax / 2).toFixed(2));
    
    // Generate standardized IDs
    const date = new Date(booking.createdAt);
    const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;
    const invoiceNo = `INV/${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${(booking._id as any).toString().slice(-4).toUpperCase()}`;
    
    const displayTxnId = booking.transactionId?.startsWith('TXN') 
      ? booking.transactionId 
      : `TXN-${dateStr}-${(booking._id as any).toString().slice(-6).toUpperCase()}`;

    res.json({
      success: true,
      data: {
        invoiceNo,
        transactionId: displayTxnId,
        date: booking.createdAt,
        subtotal,
        taxableAmount,
        cgst,
        sgst,
        grandTotal: subtotal,
        customer: booking.customer,
        vendor: booking.vendor,
        service: booking.service,
        paymentMode: booking.paymentMode || 'Online'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving invoice data' });
  }
});
