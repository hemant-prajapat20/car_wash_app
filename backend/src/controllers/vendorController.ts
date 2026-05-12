import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { Slot } from '../models/Others';
import { asyncHandler, AuthRequest } from '../middleware/auth';

export const getVendorDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;

  const totalBookings = await Booking.countDocuments({ vendor: vendorId });
  const completedBookings = await Booking.countDocuments({ vendor: vendorId, status: 'Completed' });
  const pendingBookings = await Booking.countDocuments({ vendor: vendorId, status: 'Pending' });
  
  const revenue = await Booking.aggregate([
    { $match: { vendor: vendorId, status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const recentBookings = await Booking.find({ vendor: vendorId })
    .populate('customer', 'fullName email phone')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        totalRevenue: revenue[0]?.total || 0
      },
      recentBookings
    }
  });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = status;
  if (status === 'Completed') {
    booking.completedAt = new Date();
    booking.paymentStatus = 'Success';
  }

  await booking.save();
  res.json({ success: true, message: `Booking marked as ${status}`, data: booking });
});

export const manageSlots = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  
  if (req.method === 'POST') {
    const { date, time, capacity } = req.body;
    const slot = await Slot.create({ vendor: vendorId, date, time, capacity });
    return res.status(201).json({ success: true, data: slot });
  }

  const slots = await Slot.find({ vendor: vendorId }).sort({ date: 1, time: 1 });
  res.json({ success: true, data: slots });
});

export const updateVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401);

  const { companyName, businessLocation, serviceArea, services } = req.body;
  
  user.companyName = companyName || user.companyName;
  user.businessLocation = businessLocation || user.businessLocation;
  user.serviceArea = serviceArea || user.serviceArea;
  user.services = services || user.services;

  await user.save();
  res.json({ success: true, message: 'Profile updated', data: user });
});
