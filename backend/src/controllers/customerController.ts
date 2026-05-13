import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import { Review } from '../models/Others';
import { asyncHandler, AuthRequest } from '../middleware/auth';

export const searchVendors = asyncHandler(async (req: Request, res: Response) => {
  const { city, service } = req.query;
  
  let query: any = { role: 'vendor', isActive: true };
  if (city) query.businessLocation = { $regex: city, $options: 'i' };
  if (service) query['services.name'] = { $regex: service, $options: 'i' };

  const vendors = await User.find(query).select('fullName companyName businessLocation services vendorId');
  res.json({ success: true, data: vendors });
});

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?._id;
  const { vendorId, vehicle, service, slot } = req.body;

  // 1. Check slot availability
  const slotDoc = await Slot.findOne({ vendorId: vendorId, startTime: slot.time });
  if (slotDoc && slotDoc.currentBookings >= slotDoc.maxBookings) {
    return res.status(400).json({ success: false, message: 'Slot is full' });
  }

  // 2. Create Booking
  const booking = await Booking.create({
    customer: customerId,
    vendor: vendorId,
    vehicle,
    service,
    slot,
    totalAmount: service.price,
    status: 'Pending'
  });

  // 3. Update Slot counter
  if (slotDoc) {
    slotDoc.currentBookings += 1;
    await slotDoc.save();
  }

  res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
});

export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ customer: req.user?._id })
    .populate('vendor', 'companyName businessLocation')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

export const submitReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId, rating, comment } = req.body;
  
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.status !== 'Completed') {
    return res.status(400).json({ success: false, message: 'Reviews only allowed for completed bookings' });
  }

  const review = await Review.create({
    customer: req.user?._id,
    vendor: booking.vendor,
    booking: bookingId,
    rating,
    comment
  });

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});
