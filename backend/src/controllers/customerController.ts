import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import { Review } from '../models/Others';
import { asyncHandler, AuthRequest } from '../middleware/auth';
import { createNotification } from './notificationController';

import Service from '../models/Service';

export const searchVendors = asyncHandler(async (req: Request, res: Response) => {
  const { city, service } = req.query;

  let query: any = { role: 'vendor', isActive: true };
  if (city) query.businessLocation = { $regex: city, $options: 'i' };

  // Basic match for vendors
  const vendors = await User.find(query).select('fullName companyName businessLocation phone vendorId avatar');

  const detailedVendors = await Promise.all(vendors.map(async (v) => {
    // Get their active services
    const services = await Service.find({ vendorId: v._id, isActive: true });

    // Filter by service if query provided
    if (service && !services.some(s => s.name.toLowerCase().includes((service as string).toLowerCase()))) {
      return null;
    }

    // Calculate starting price
    const startingPrice = services.length > 0 ? Math.min(...services.map(s => s.price)) : 0;

    // Count available slots
    const slots = await Slot.find({ vendorId: v._id, isAvailable: true });

    return {
      ...v.toObject(),
      activeServices: services.slice(0, 3).map(s => s.name), // Just send top 3 for preview
      startingPrice,
      availableSlotsCount: slots.length
    };
  }));

  const validVendors = detailedVendors.filter(v => v !== null);

  res.json({ success: true, data: validVendors });
});

export const getVendorDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vendorId } = req.params;

  const vendor = await User.findOne({ _id: vendorId, role: 'vendor', isActive: true }).select('-password');
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

  const services = await Service.find({ vendorId, isActive: true });
  const slots = await Slot.find({ vendorId, isAvailable: true });
  const reviews = await Review.find({ vendor: vendorId }).populate('customer', 'fullName');

  res.json({ success: true, data: { vendor, services, slots, reviews } });
});

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?._id;
  const { vendorId, vehicle, service, slot, paymentMode = 'Online', serviceType = 'Shop', homeAddress } = req.body;

  // 1. Validate Home Service parameters if selected
  if (serviceType === 'Home') {
    if (!homeAddress || !homeAddress.address || !homeAddress.city) {
      return res.status(400).json({ success: false, message: 'Home address and city are required for home service bookings.' });
    }
    const vendorDoc = await User.findById(vendorId);
    if (!vendorDoc || !vendorDoc.isHomeServiceAvailable) {
      return res.status(400).json({ success: false, message: 'This vendor does not support home service.' });
    }
  }

  // 2. Check slot availability
  const slotDoc = await Slot.findOne({ vendorId: vendorId, startTime: slot.time });
  if (slotDoc && slotDoc.currentBookings >= slotDoc.maxBookings) {
    return res.status(400).json({ success: false, message: 'Slot is full' });
  }

  // 3. Create Booking (Cash goes straight to 'Confirmed', Online stays 'Pending' until signature verified)
  const bookingStatus = paymentMode === 'Cash' ? 'Confirmed' : 'Pending';

  const booking = await Booking.create({
    customer: customerId,
    vendor: vendorId,
    vehicle,
    service,
    slot,
    totalAmount: service.price,
    status: bookingStatus,
    paymentMode,
    serviceType,
    homeAddress: serviceType === 'Home' ? homeAddress : undefined
  });

  // 4. Update Slot counter
  if (slotDoc) {
    slotDoc.currentBookings += 1;
    await slotDoc.save();
  }

  // 5. Create Notification for Vendor
  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'New Booking Received',
    message: `You have a new booking for ${vehicle.make} ${vehicle.model} on ${slot.time}.${serviceType === 'Home' ? ' [HOME SERVICE]' : ''}`,
    type: 'booking_created',
    status: 'info'
  });

  // 6. Create Confirmation Notification for Customer
  await createNotification({
    receiverId: customerId,
    receiverRole: 'customer',
    title: 'Booking Successful! ✅',
    message: `Your booking for ${service.name} has been placed successfully for ${slot.time}.${paymentMode === 'Cash' ? ' Payment mode: Cash.' : ''}`,
    type: 'booking_created',
    status: 'success'
  });

  res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
});

export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ customer: req.user?._id })
    .populate('vendor', 'companyName businessLocation')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

export const deleteBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const booking = await Booking.findOneAndDelete({ _id: id, customer: req.user?._id, paymentStatus: 'Pending' });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found or already processed' });
  
  // Restore slot capacity if needed
  const slotDoc = await Slot.findOne({ vendorId: booking.vendor, startTime: booking.slot.time });
  if (slotDoc && slotDoc.currentBookings > 0) {
    slotDoc.currentBookings -= 1;
    await slotDoc.save();
  }

  res.json({ success: true, message: 'Booking deleted' });
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

  // Create Notification for Vendor
  await createNotification({
    receiverId: booking.vendor,
    receiverRole: 'vendor',
    title: 'New Review Received',
    message: `A customer has left a ${rating}-star review for your service.`,
    type: 'system_alert',
    status: 'success'
  });

  res.status(201).json({ success: true, message: 'Review submitted', data: review });
});
export const addVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.vehicles?.push(req.body);
  await user.save();

  res.json({ success: true, data: user.vehicles, message: 'Vehicle added successfully' });
});

export const getVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id).select('vehicles');
  res.json({ success: true, data: user?.vehicles || [] });
});

export const deleteVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  const user = await User.findById(req.user?._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.vehicles = user.vehicles?.filter((v: any) => v._id.toString() !== vehicleId);
  await user.save();

  res.json({ success: true, data: user.vehicles, message: 'Vehicle removed' });
});
