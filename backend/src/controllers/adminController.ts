import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import { asyncHandler } from '../middleware/auth';

export const registerVendor = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password, companyName, businessLocation } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Vendor email already registered' });
  }

  const vendor = await User.create({
    fullName,
    email,
    phone,
    password,
    companyName,
    businessLocation,
    role: 'vendor'
  });

  res.status(201).json({
    success: true,
    message: 'Vendor account created successfully',
    data: vendor
  });
});

export const getPlatformStats = asyncHandler(async (req: Request, res: Response) => {
  const totalVendors = await User.countDocuments({ role: 'vendor' });
  const activeVendors = await User.countDocuments({ role: 'vendor', isActive: true });
  const totalBookings = await Booking.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  
  // Aggregate revenue (simplified)
  const revenueData = await Booking.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalVendors,
        activeVendors,
        totalBookings,
        totalCustomers,
        totalRevenue: revenueData[0]?.total || 0
      },
      recentRegistrations: await User.find({ role: 'vendor' }).sort({ createdAt: -1 }).limit(5)
    }
  });
});

export const getAllVendors = asyncHandler(async (req: Request, res: Response) => {
  const vendors = await User.find({ role: 'vendor' }).sort({ createdAt: -1 });
  res.json({ success: true, data: vendors });
});

export const toggleVendorStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const vendor = await User.findById(id);
  
  if (!vendor || vendor.role !== 'vendor') {
    return res.status(404).json({ success: false, message: 'Vendor not found' });
  }

  vendor.isActive = !vendor.isActive;
  await vendor.save();

  res.json({ 
    success: true, 
    message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
    data: vendor 
  });
});
