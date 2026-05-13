import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Slot from '../models/Slot';
import Service from '../models/Service';
import Worker from '../models/Worker';
import Booking from '../models/Booking';
import User from '../models/User';
import { asyncHandler } from '../middleware/auth';

// --- DASHBOARD & PROFILE ---
export const getVendorDashboard = asyncHandler(async (req: any, res: Response) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const vendorId = req.user._id;
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId.toString());
  
  try {
    const totalBookings = await Booking.countDocuments({ vendor: vendorObjectId });
    const completedBookings = await Booking.countDocuments({ vendor: vendorObjectId, status: 'Completed' });
    const pendingBookings = await Booking.countDocuments({ vendor: vendorObjectId, status: 'Pending' });
    const totalWorkers = await Worker.countDocuments({ vendorId: vendorObjectId });
    
    // Revenue Aggregation
    const revenueResult = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Most Popular Slot Aggregation
    const popularSlotResult = await Booking.aggregate([
      { $match: { vendor: vendorObjectId } },
      { $group: { _id: '$slot.startTime', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    // Top Customers Aggregation (Highest Payers)
    const topCustomersResult = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed' } },
      { $group: { 
          _id: '$customer', 
          totalSpent: { $sum: '$totalAmount' },
          bookingsCount: { $sum: 1 }
      } },
      { $sort: { totalSpent: -1 } },
      { $limit: 6 },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customerDetails'
      } },
      { $unwind: '$customerDetails' },
      { $project: {
          _id: 1,
          totalSpent: 1,
          bookingsCount: 1,
          'customerDetails.fullName': 1,
          'customerDetails.email': 1,
          'customerDetails.avatar': 1
      } }
    ]);

    const recentBookings = await Booking.find({ vendor: vendorObjectId })
      .populate('customer', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          completedBookings,
          pendingBookings,
          totalWorkers,
          revenue: revenueResult[0]?.total || 0,
          popularSlot: popularSlotResult[0]?._id || 'N/A'
        },
        topCustomers: topCustomersResult,
        recentBookings
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Dashboard analysis failed: ${err.message}` });
  }
});

export const updateBookingStatus = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = await Booking.findOneAndUpdate(
    { _id: id, vendor: req.user._id },
    { status },
    { new: true }
  );
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
});

export const getVendorProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'Vendor not found' });
  res.json({ success: true, data: user });
});

export const updateVendorProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
  res.json({ success: true, data: user });
});

// --- SLOT MANAGEMENT ---
export const manageSlots = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  
  if (req.method === 'POST') {
    const { startTime, endTime, maxBookings, dayOfWeek } = req.body;
    const validMaxBookings = Math.max(1, parseInt(maxBookings as string) || 1);

    const slot = await Slot.create({ 
      startTime,
      endTime,
      dayOfWeek: dayOfWeek || 'All',
      maxBookings: validMaxBookings,
      vendorId
    });
    return res.status(201).json({ success: true, data: slot });
  }
  
  const slots = await Slot.find({ vendorId }).sort({ startTime: 1 });
  res.json({ success: true, data: slots });
});

export const addSlot = manageSlots;
export const getSlots = manageSlots;

export const updateSlot = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  if (req.body.maxBookings !== undefined) {
    req.body.maxBookings = Math.max(1, parseInt(req.body.maxBookings as string) || 1);
  }
  const slot = await Slot.findOneAndUpdate(
    { _id: req.params.id, vendorId },
    req.body,
    { new: true }
  );
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  res.json({ success: true, data: slot });
});

export const deleteSlot = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const slot = await Slot.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  res.json({ success: true, message: 'Slot removed' });
});

// --- SERVICE MANAGEMENT ---
export const addService = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const { price, duration } = req.body;
  req.body.price = Math.max(1, parseInt(price as string) || 1);
  req.body.duration = Math.max(1, parseInt(duration as string) || 1);

  const service = await Service.create({
    ...req.body,
    vendorId
  });
  res.status(201).json({ success: true, data: service });
});

export const getServices = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const services = await Service.find({ vendorId }).sort({ createdAt: -1 });
  res.json({ success: true, data: services });
});

export const updateService = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  if (req.body.price !== undefined) req.body.price = Math.max(1, parseInt(req.body.price as string) || 1);
  if (req.body.duration !== undefined) req.body.duration = Math.max(1, parseInt(req.body.duration as string) || 1);

  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, vendorId },
    req.body,
    { new: true }
  );
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const service = await Service.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, message: 'Service removed' });
});

// --- WORKER MANAGEMENT ---
export const addWorker = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const worker = await Worker.create({
    ...req.body,
    vendorId
  });
  res.status(201).json({ success: true, data: worker });
});

export const getWorkers = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const workers = await Worker.find({ vendorId }).sort({ createdAt: -1 });
  res.json({ success: true, data: workers });
});

export const updateWorker = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const worker = await Worker.findOneAndUpdate(
    { _id: req.params.id, vendorId },
    req.body,
    { new: true }
  );
  if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
  res.json({ success: true, data: worker });
});

export const deleteWorker = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const worker = await Worker.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
  res.json({ success: true, message: 'Worker removed' });
});
