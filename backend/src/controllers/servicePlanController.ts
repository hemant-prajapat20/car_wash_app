import { Request, Response } from 'express';
import { asyncHandler, AuthRequest } from '../middleware/auth';
import ServicePlan from '../models/ServicePlan';
import CustomerPlan from '../models/CustomerPlan';
import Booking from '../models/Booking';
import { createNotification } from './notificationController';
import crypto from 'crypto';

// ================= VENDOR ROUTES =================

export const createServicePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  
  const { title, description, servicesIncluded, price, tenure, supportedVehicles, features } = req.body;

  const newPlan = await ServicePlan.create({
    vendor: vendorId,
    title,
    description,
    servicesIncluded,
    price,
    tenure,
    supportedVehicles,
    features,
    isActive: true
  });

  res.status(201).json({ success: true, data: newPlan });
});

export const getVendorServicePlans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  const plans = await ServicePlan.find({ vendor: vendorId }).sort({ createdAt: -1 });
  res.json({ success: true, data: plans });
});

export const updateServicePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  const { id } = req.params;

  const plan = await ServicePlan.findOneAndUpdate(
    { _id: id, vendor: vendorId },
    req.body,
    { returnDocument: 'after', runValidators: true }
  );

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  res.json({ success: true, data: plan });
});

export const toggleServicePlanStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  const { id } = req.params;

  const plan = await ServicePlan.findOne({ _id: id, vendor: vendorId });
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  res.json({ success: true, data: plan });
});

export const scanPlanQR = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendorId = req.user?._id;
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'QR token is required' });
  }

  const customerPlan = await CustomerPlan.findOne({ qrToken: token })
    .populate('servicePlan')
    .populate('customer');

  if (!customerPlan) {
    return res.status(404).json({ success: false, message: 'Invalid QR token' });
  }

  if (customerPlan.vendor.toString() !== vendorId?.toString()) {
    return res.status(403).json({ success: false, message: 'This plan belongs to another vendor' });
  }

  if (customerPlan.status !== 'Active') {
    return res.status(400).json({ success: false, message: `Plan is ${customerPlan.status}` });
  }

  if (customerPlan.remainingServices <= 0) {
    customerPlan.status = 'Completed';
    await customerPlan.save();
    return res.status(400).json({ success: false, message: 'Plan fully used' });
  }

  if (new Date() > new Date(customerPlan.expiresAt)) {
    customerPlan.status = 'Expired';
    await customerPlan.save();
    return res.status(400).json({ success: false, message: 'Plan expired' });
  }

  // Consume one service
  customerPlan.remainingServices -= 1;
  
  const washNumber = customerPlan.totalServices - customerPlan.remainingServices;
  const planTitle = (customerPlan.servicePlan as any)?.title || 'Service Plan';

  customerPlan.serviceHistory.push({
    usedAt: new Date(),
    vendor: vendorId as any,
    notes: `Service consumed via QR scan. Wash #${washNumber}`
  });

  if (customerPlan.remainingServices === 0) {
    customerPlan.status = 'Completed';
  }

  await customerPlan.save();

  // Create "In Progress" booking to start service automatically
  const booking = await Booking.create({
    customer: customerPlan.customer._id,
    vendor: customerPlan.vendor,
    vehicle: customerPlan.vehicle,
    service: {
      name: `${planTitle} (Wash #${washNumber})`,
      price: 0,
      duration: 30
    },
    slot: {
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    status: 'In Progress',
    paymentStatus: 'Success',
    totalAmount: 0,
    paymentMode: 'Online',
    serviceType: 'Shop'
  });

  // Notify Customer
  await createNotification({
    receiverId: customerPlan.customer._id,
    receiverRole: 'customer',
    vendorId: vendorId,
    title: 'Prepaid Service Started! 🚗',
    message: `Wash #${washNumber} of your "${planTitle}" plan has started. Remaining: ${customerPlan.remainingServices} washes.`,
    type: 'booking_confirmed',
    status: 'success',
    bookingId: (booking._id as any).toString()
  });

  // Notify Vendor
  await createNotification({
    receiverId: vendorId,
    receiverRole: 'vendor',
    vendorId: vendorId,
    title: 'Prepaid Service Started 🧼',
    message: `Plan QR scanned for vehicle "${customerPlan.vehicle.make} ${customerPlan.vehicle.model} (${customerPlan.vehicle.plateNumber})". Wash #${washNumber} is In Progress.`,
    type: 'booking_confirmed',
    status: 'info',
    bookingId: (booking._id as any).toString()
  });

  res.json({
    success: true,
    message: 'Service consumed and automatically started successfully',
    data: {
      remainingServices: customerPlan.remainingServices,
      status: customerPlan.status,
      booking
    }
  });
});

// ================= CUSTOMER ROUTES =================

export const getActiveServicePlansByVendor = asyncHandler(async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const plans = await ServicePlan.find({ vendor: vendorId, isActive: true }).sort({ price: 1 });
  res.json({ success: true, data: plans });
});

export const purchasePlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?._id;
  const { planId, vehicle } = req.body;

  if (!planId) {
    return res.status(400).json({ success: false, message: 'planId is required' });
  }
  if (!vehicle?.make || !vehicle?.model || !vehicle?.plateNumber) {
    return res.status(400).json({ success: false, message: 'Vehicle make, model and plateNumber are required' });
  }

  const plan = await ServicePlan.findById(planId);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }
  if (!plan.isActive) {
    return res.status(400).json({ success: false, message: 'This plan is no longer active' });
  }

  // Calculate expiry date
  const expiresAt = new Date();
  if (plan.tenure.unit === 'Days') {
    expiresAt.setDate(expiresAt.getDate() + plan.tenure.value);
  } else if (plan.tenure.unit === 'Months') {
    expiresAt.setMonth(expiresAt.getMonth() + plan.tenure.value);
  }

  const qrToken = crypto.randomBytes(32).toString('hex');

  const customerPlan = await CustomerPlan.create({
    customer: customerId,
    vendor: plan.vendor,
    servicePlan: plan._id,
    vehicle: {
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber
    },
    totalServices: plan.servicesIncluded,
    remainingServices: plan.servicesIncluded,
    expiresAt,
    status: 'PendingPayment',
    paymentStatus: 'Pending',
    qrToken
  });

  res.status(201).json({ success: true, data: customerPlan });
});

export const getMyPlans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?._id;
  const plans = await CustomerPlan.find({ customer: customerId, status: { $ne: 'PendingPayment' } })
    .populate('servicePlan vendor', 'title description companyName fullName')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: plans });
});

export const getCustomerPlanById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const customerId = req.user?._id;
  const { id } = req.params;
  const plan = await CustomerPlan.findOne({ _id: id, customer: customerId })
    .populate('servicePlan vendor', 'title description companyName fullName');
  
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }
  
  res.json({ success: true, data: plan });
});
