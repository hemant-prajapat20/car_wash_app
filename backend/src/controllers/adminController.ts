import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import { asyncHandler } from '../middleware/auth';
import { createNotification } from '../controllers/notificationController';
import Notification from '../models/Notification';

export const registerVendor = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password, companyName, businessLocation, planName, subscriptionStart, subscriptionEnd } = req.body;

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
    role: 'vendor',
    planName,
    subscriptionStart,
    subscriptionEnd,
    paymentStatus: 'pending',
  });

  // Notify SuperAdmin
  const superAdmin = await User.findOne({ role: 'superAdmin' });
  if (superAdmin) {
    await createNotification({
      receiverId: superAdmin._id,
      receiverRole: 'superAdmin',
      title: 'New Vendor Registration',
      message: `A new vendor "${companyName}" has been registered by an admin.`,
      type: 'vendor_registration',
      status: 'info'
    });
  }

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
  
  // New metrics for enterprise oversight
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayRegistrations = await User.countDocuments({ 
    role: 'vendor', 
    createdAt: { $gte: startOfToday } 
  });
  const pendingRequests = await User.countDocuments({ 
    role: 'vendor', 
    isActive: false 
  });

  // Aggregate revenue
  const revenueData = await Booking.aggregate([
    { $match: { status: 'Completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  // Fetch recent notifications for the current admin
  const adminId = (req as any).user.id;
  let recentNotifications: any[] = [];
  if (adminId) {
    recentNotifications = await Notification.find({ receiverId: adminId })
      .sort({ createdAt: -1 })
      .limit(10);
  }

  res.json({
    success: true,
    data: {
      stats: {
        totalVendors,
        activeVendors,
        totalBookings,
        totalCustomers,
        totalRevenue: revenueData[0]?.total || 0,
        todayRegistrations,
        pendingRequests
      },
      recentNotifications
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

  // Notify Vendor
  await createNotification({
    receiverId: vendor._id,
    receiverRole: 'vendor',
    title: 'Account Status Updated',
    message: `Your account has been ${vendor.isActive ? 'activated' : 'deactivated'} by the system administrator.`,
    type: 'system_alert',
    status: vendor.isActive ? 'success' : 'warning'
  });

  // Notify all Admins and SuperAdmins (audit log)
  const systemAdmins = await User.find({ role: { $in: ['admin', 'superAdmin'] } });
  for (const admin of systemAdmins) {
    await createNotification({
      receiverId: admin._id,
      receiverRole: admin.role,
      title: `Vendor ${vendor.isActive ? 'Activated' : 'Suspended'}`,
      message: `Vendor "${vendor.companyName}" has been ${vendor.isActive ? 'activated' : 'suspended'} by the system.`,
      type: 'system_alert',
      status: vendor.isActive ? 'success' : 'warning'
    });
  }

  res.json({ 
    success: true, 
    message: `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`,
    data: vendor 
  });
});
