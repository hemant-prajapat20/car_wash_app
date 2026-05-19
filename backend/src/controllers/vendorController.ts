import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Slot from '../models/Slot';
import Service from '../models/Service';
import Worker from '../models/Worker';
import Booking from '../models/Booking';
import User from '../models/User';
import CustomerPlan from '../models/CustomerPlan';
import { asyncHandler } from '../middleware/auth';
import { createNotification } from './notificationController';

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

    // Plan Revenue Aggregation
    const planRevenueResult = await CustomerPlan.aggregate([
      { $match: { vendor: vendorObjectId, paymentStatus: 'Success' } },
      { $lookup: {
          from: 'serviceplans',
          localField: 'servicePlan',
          foreignField: '_id',
          as: 'planDetails'
      } },
      { $unwind: '$planDetails' },
      { $group: { _id: null, total: { $sum: '$planDetails.price' } } }
    ]);

    const bookingRevenue = revenueResult[0]?.total || 0;
    const planRevenue = planRevenueResult[0]?.total || 0;
    const totalRevenue = bookingRevenue + planRevenue;

    const recentBookings = await Booking.find({ vendor: vendorObjectId })
      .populate('customer', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(50);

    const recentPlans = await CustomerPlan.find({ vendor: vendorObjectId, paymentStatus: 'Success' })
      .populate('customer', 'fullName email')
      .populate('servicePlan', 'title price')
      .sort({ createdAt: -1 })
      .limit(50);

    const mappedBookings = recentBookings.map(bk => ({
      ...bk.toObject(),
      isPlanPurchase: false,
      activityType: 'Booking'
    }));

    const mappedPlans = recentPlans.map(pl => {
      const plObj = pl.toObject();
      return {
        ...plObj,
        bookingId: `PLN-${pl._id.toString().slice(-6).toUpperCase()}`,
        service: {
          name: (pl.servicePlan as any)?.title || 'Service Plan',
          price: (pl.servicePlan as any)?.price || 0,
          duration: 0
        },
        slot: {
          date: pl.purchasedAt || pl.createdAt,
          time: 'N/A'
        },
        status: pl.status === 'Active' ? 'Confirmed' : pl.status === 'Completed' ? 'Completed' : 'Pending',
        isPlanPurchase: true,
        activityType: 'Subscription Plan',
        totalServices: pl.totalServices,
        remainingServices: pl.remainingServices
      };
    });

    const combinedActivities = [...mappedBookings, ...mappedPlans].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          completedBookings,
          pendingBookings,
          totalWorkers,
          revenue: totalRevenue,
          popularSlot: popularSlotResult[0]?._id || 'N/A'
        },
        topCustomers: topCustomersResult,
        recentBookings: combinedActivities
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: `Dashboard analysis failed: ${err.message}` });
  }
});

export const updateBookingStatus = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const currentBooking = await Booking.findOne({ _id: id, vendor: req.user._id });
  if (!currentBooking) return res.status(404).json({ success: false, message: 'Booking not found' });

  const updateFields: any = { status };

  if (status === 'Completed') {
    updateFields.completedAt = new Date();
    if (currentBooking.paymentMode === 'Cash') {
      updateFields.paymentStatus = 'Success';
      if (!currentBooking.transactionId) {
        const date = new Date();
        const dateStr = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}`;
        updateFields.transactionId = `TXN-CSH-${dateStr}-${currentBooking._id.toString().slice(-6).toUpperCase()}`;
      }
    }
  }

  const booking = await Booking.findByIdAndUpdate(
    currentBooking._id,
    updateFields,
    { new: true }
  );
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  // Create Notification for Customer
  let notificationTitle = 'Booking Status Update';
  let notificationMessage = `Your booking status has been updated to ${status}.`;
  let notificationType: any = 'system_alert';

  if (status === 'Confirmed') {
    notificationTitle = 'Booking Confirmed';
    notificationMessage = 'Your car wash booking has been confirmed by the vendor.';
    notificationType = 'booking_confirmed';
  } else if (status === 'Completed') {
    notificationTitle = 'Service Completed';
    notificationMessage = 'Great news! Your car wash service is complete. Please rate your experience.';
    notificationType = 'booking_completed';
  } else if (status === 'Cancelled') {
    notificationTitle = 'Booking Cancelled';
    notificationMessage = 'Your booking has been cancelled by the vendor.';
    notificationType = 'booking_cancelled';
  }

  await createNotification({
    receiverId: booking.customer,
    receiverRole: 'customer',
    vendorId: req.user._id,
    title: notificationTitle,
    message: notificationMessage,
    type: notificationType,
    status: status === 'Cancelled' ? 'error' : status === 'Completed' ? 'success' : 'info',
    bookingId: booking._id.toString()
  });

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

    // Notify SuperAdmin of potential system update (optional, but good for tracking)
    // For now, let's just return
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

  // Optional: Notify vendor of slot change (internal log)
  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Slot Updated',
    message: `Your booking slot for ${slot.startTime} has been updated.`,
    type: 'slot_updated',
    status: 'info'
  });

  res.json({ success: true, data: slot });
});

export const deleteSlot = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const slot = await Slot.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Slot Removed',
    message: `Your booking slot for ${slot.startTime} has been removed.`,
    type: 'slot_updated',
    status: 'warning'
  });

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

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Service Updated',
    message: `Service "${service.name}" has been successfully updated.`,
    type: 'service_updated',
    status: 'success'
  });

  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const service = await Service.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Service Removed',
    message: `Service "${service.name}" has been removed from your list.`,
    type: 'service_updated',
    status: 'warning'
  });

  res.json({ success: true, message: 'Service removed' });
});

// --- WORKER MANAGEMENT ---
export const addWorker = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const worker = await Worker.create({
    ...req.body,
    vendorId
  });

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'New Worker Added',
    message: `Worker "${worker.name}" has been added to your team.`,
    type: 'worker_assignment',
    status: 'success'
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

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Worker Profile Updated',
    message: `Details for worker "${worker.name}" have been updated.`,
    type: 'worker_assignment',
    status: 'info'
  });

  res.json({ success: true, data: worker });
});

export const deleteWorker = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const worker = await Worker.findOneAndDelete({ _id: req.params.id, vendorId });
  if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });

  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    title: 'Worker Removed',
    message: `Worker "${worker.name}" has been removed from your team.`,
    type: 'worker_assignment',
    status: 'warning'
  });

  res.json({ success: true, message: 'Worker removed' });
});

// --- SMART SEARCH ---
export const searchVendorData = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.json({ success: true, data: { bookings: [], workers: [], services: [] } });
  }

  const regex = new RegExp(query, 'i');

  // 1. Search Bookings (Populate customer to search by name)
  const bookings = await Booking.find({ vendor: vendorId })
    .populate('customer', 'fullName email')
    .then(docs => docs.filter(doc => 
      (doc.customer as any)?.fullName.match(regex) || 
      doc.vehicle?.plateNumber?.match(regex) ||
      doc.service?.name?.match(regex) ||
      doc.status.match(regex)
    ).slice(0, 5));

  // 2. Search Workers
  const workers = await Worker.find({ 
    vendorId, 
    $or: [{ name: regex }, { expertise: regex }, { phone: regex }] 
  }).limit(5);

  // 3. Search Services
  const services = await Service.find({ 
    vendorId, 
    $or: [{ name: regex }, { category: regex }] 
  }).limit(5);

  res.json({
    success: true,
    data: {
      bookings,
      workers,
      services
    }
  });
});

// --- CUSTOMER MANAGEMENT ---
export const getVendorCustomers = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId.toString());

  try {
    const customers = await Booking.aggregate([
      { $match: { vendor: vendorObjectId } },
      { $group: { 
          _id: '$customer', 
          bookingsCount: { $sum: 1 },
          avgRating: { $avg: '$rating' } 
      } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'details'
      } },
      { $unwind: '$details' },
      { $project: {
          _id: 1,
          bookingsCount: 1,
          avgRating: { $ifNull: ['$avgRating', 5.0] },
          name: '$details.fullName',
          email: '$details.email',
          avatar: '$details.avatar',
          phone: '$details.phone'
      } }
    ]);

    res.json({ success: true, data: customers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- FINANCES & TRANSACTIONS ---
export const getVendorTransactions = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;

  try {
    const bookings = await Booking.find({ vendor: vendorId })
      .populate('customer vendor', 'fullName email phone address companyName businessLocation')
      .select('transactionId totalAmount paymentStatus status createdAt customer vendor service paymentMode');

    const plans = await CustomerPlan.find({ vendor: vendorId, paymentStatus: 'Success' })
      .populate('customer vendor servicePlan')
      .select('servicePlan vehicle totalServices remainingServices status paymentStatus paymentMode purchasedAt customer vendor createdAt');

    const formattedBookings = bookings.map(tx => {
      const txAny = tx as any;
      const subtotal = tx.totalAmount;
      const taxableAmount = parseFloat((subtotal / 1.18).toFixed(2));
      const totalTax = parseFloat((subtotal - taxableAmount).toFixed(2));
      const cgst = parseFloat((totalTax / 2).toFixed(2));
      const sgst = parseFloat((totalTax / 2).toFixed(2));
      
      const dateObj = new Date(txAny.createdAt);
      const dateStr = `${dateObj.getFullYear()}${(dateObj.getMonth()+1).toString().padStart(2,'0')}${dateObj.getDate().toString().padStart(2,'0')}`;
      const invoiceNo = `INV/${dateObj.getFullYear()}/${(dateObj.getMonth()+1).toString().padStart(2,'0')}/${tx._id.toString().slice(-4).toUpperCase()}`;
      
      const displayTxnId = tx.transactionId?.startsWith('TXN') 
         ? tx.transactionId 
         : `TXN-${dateStr}-${tx._id.toString().slice(-6).toUpperCase()}`;

      return {
        id: displayTxnId,
        bookingId: tx._id.toString(),
        cust: (tx.customer as any)?.fullName || 'Walk-in',
        amt: `${tx.status === 'Cancelled' ? '-' : '+'}₹${tx.totalAmount}`,
        date: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: tx.paymentStatus === 'Success' ? 'Success' : tx.paymentStatus === 'Failed' ? 'Failed' : tx.status === 'Cancelled' ? 'Refund' : 'Pending',
        paymentMode: txAny.paymentMode || 'Online',
        createdAt: tx.createdAt,
        invoiceData: {
          invoiceNo,
          transactionId: displayTxnId,
          date: txAny.createdAt,
          subtotal,
          taxableAmount,
          cgst,
          sgst,
          grandTotal: subtotal,
          customer: tx.customer,
          vendor: tx.vendor, 
          service: tx.service,
          paymentMode: txAny.paymentMode || 'Online'
        }
      };
    });

    const formattedPlans = plans.map(plan => {
      const planAny = plan as any;
      const subtotal = planAny.servicePlan?.price || 0;
      const taxableAmount = parseFloat((subtotal / 1.18).toFixed(2));
      const totalTax = parseFloat((subtotal - taxableAmount).toFixed(2));
      const cgst = parseFloat((totalTax / 2).toFixed(2));
      const sgst = parseFloat((totalTax / 2).toFixed(2));
      
      const dateObj = new Date(planAny.purchasedAt || planAny.createdAt);
      const dateStr = `${dateObj.getFullYear()}${(dateObj.getMonth()+1).toString().padStart(2,'0')}${dateObj.getDate().toString().padStart(2,'0')}`;
      const invoiceNo = `PLN/${dateObj.getFullYear()}/${(dateObj.getMonth()+1).toString().padStart(2,'0')}/${plan._id.toString().slice(-4).toUpperCase()}`;
      const displayTxnId = `TXN-PLN-${dateStr}-${plan._id.toString().slice(-6).toUpperCase()}`;

      return {
        id: displayTxnId,
        bookingId: plan._id.toString(),
        cust: (plan.customer as any)?.fullName || 'Customer',
        amt: `+₹${subtotal}`,
        date: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Success',
        paymentMode: planAny.paymentMode || 'Online',
        createdAt: planAny.purchasedAt || planAny.createdAt,
        invoiceData: {
          invoiceNo,
          transactionId: displayTxnId,
          date: planAny.purchasedAt || planAny.createdAt,
          subtotal,
          taxableAmount,
          cgst,
          sgst,
          grandTotal: subtotal,
          customer: plan.customer,
          vendor: plan.vendor, 
          service: { name: planAny.servicePlan?.title || 'Service Subscription' },
          paymentMode: planAny.paymentMode || 'Online'
        }
      };
    });

    const combined = [...formattedBookings, ...formattedPlans].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({ success: true, data: combined });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- COMPREHENSIVE REPORTS ---
export const getVendorReports = asyncHandler(async (req: any, res: Response) => {
  const vendorId = req.user._id;
  const vendorObjectId = new mongoose.Types.ObjectId(vendorId.toString());

  try {
    // ── Summary stats ──────────────────────────────────────
    const totalBookings    = await Booking.countDocuments({ vendor: vendorObjectId });
    const completedBookings= await Booking.countDocuments({ vendor: vendorObjectId, status: 'Completed' });
    const cancelledBookings= await Booking.countDocuments({ vendor: vendorObjectId, status: 'Cancelled' });
    const pendingBookings  = await Booking.countDocuments({ vendor: vendorObjectId, status: 'Pending' });
    const totalCustomers   = await Booking.distinct('customer', { vendor: vendorObjectId });

    // ── Booking revenue ────────────────────────────────────
    const bookingRevenueAgg = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const bookingRevenue = bookingRevenueAgg[0]?.total || 0;

    // ── Plan revenue ───────────────────────────────────────
    const planRevenueAgg = await CustomerPlan.aggregate([
      { $match: { vendor: vendorObjectId, paymentStatus: 'Success' } },
      { $lookup: { from: 'serviceplans', localField: 'servicePlan', foreignField: '_id', as: 'sp' } },
      { $unwind: '$sp' },
      { $group: { _id: null, total: { $sum: '$sp.price' } } }
    ]);
    const planRevenue = planRevenueAgg[0]?.total || 0;
    const totalRevenue = bookingRevenue + planRevenue;

    // ── GST breakdown (18% GST included in price) ─────────
    const gstOnBookings = parseFloat(((bookingRevenue - bookingRevenue / 1.18)).toFixed(2));
    const gstOnPlans    = parseFloat(((planRevenue    - planRevenue    / 1.18)).toFixed(2));
    const totalGst      = parseFloat((gstOnBookings + gstOnPlans).toFixed(2));
    const cgst          = parseFloat((totalGst / 2).toFixed(2));
    const sgst          = parseFloat((totalGst / 2).toFixed(2));

    // ── Monthly revenue trend (last 6 months) ─────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyPlans = await CustomerPlan.aggregate([
      { $match: { vendor: vendorObjectId, paymentStatus: 'Success', createdAt: { $gte: sixMonthsAgo } } },
      { $lookup: { from: 'serviceplans', localField: 'servicePlan', foreignField: '_id', as: 'sp' } },
      { $unwind: '$sp' },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$sp.price' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyMap: Record<string, { label: string; bookingRevenue: number; planRevenue: number; bookings: number; plans: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthlyMap[key] = { label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`, bookingRevenue: 0, planRevenue: 0, bookings: 0, plans: 0 };
    }
    monthlyBookings.forEach(m => {
      const key = `${m._id.year}-${m._id.month}`;
      if (monthlyMap[key]) { monthlyMap[key].bookingRevenue = m.revenue; monthlyMap[key].bookings = m.count; }
    });
    monthlyPlans.forEach(m => {
      const key = `${m._id.year}-${m._id.month}`;
      if (monthlyMap[key]) { monthlyMap[key].planRevenue = m.revenue; monthlyMap[key].plans = m.count; }
    });
    const monthlyTrend = Object.values(monthlyMap);

    // ── Top services by bookings ───────────────────────────
    const topServices = await Booking.aggregate([
      { $match: { vendor: vendorObjectId } },
      { $group: { _id: '$service.name', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // ── Top customers ──────────────────────────────────────
    const topCustomers = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed' } },
      { $group: { _id: '$customer', spent: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { spent: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $project: { name: '$u.fullName', email: '$u.email', spent: 1, count: 1 } }
    ]);

    // ── Plans & subscriptions ──────────────────────────────
    const activePlans   = await CustomerPlan.countDocuments({ vendor: vendorObjectId, status: 'Active' });
    const completedPlans= await CustomerPlan.countDocuments({ vendor: vendorObjectId, status: 'Completed' });
    const expiredPlans  = await CustomerPlan.countDocuments({ vendor: vendorObjectId, status: 'Expired' });
    const totalPlansSold= await CustomerPlan.countDocuments({ vendor: vendorObjectId, paymentStatus: 'Success' });

    const planDetails = await CustomerPlan.find({ vendor: vendorObjectId, paymentStatus: 'Success' })
      .populate('customer', 'fullName email')
      .populate('servicePlan', 'title price')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('customer servicePlan totalServices remainingServices status paymentStatus createdAt vehicle');

    // ── Recent transactions (last 15) ─────────────────────
    const recentTxns = await Booking.find({ vendor: vendorObjectId })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 })
      .limit(15)
      .select('customer service totalAmount status paymentStatus createdAt transactionId');

    // ── Payment mode breakdown ─────────────────────────────
    const paymentModeAgg = await Booking.aggregate([
      { $match: { vendor: vendorObjectId, status: 'Completed' } },
      { $group: { _id: '$paymentMode', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // ── Service type breakdown ─────────────────────────────
    const serviceTypeAgg = await Booking.aggregate([
      { $match: { vendor: vendorObjectId } },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue, bookingRevenue, planRevenue,
          totalBookings, completedBookings, cancelledBookings, pendingBookings,
          totalCustomers: totalCustomers.length,
          totalGst, cgst, sgst, gstOnBookings, gstOnPlans,
          totalPlansSold, activePlans, completedPlans, expiredPlans
        },
        monthlyTrend,
        topServices,
        topCustomers,
        planDetails,
        recentTxns,
        paymentModeBreakdown: paymentModeAgg,
        serviceTypeBreakdown: serviceTypeAgg
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
