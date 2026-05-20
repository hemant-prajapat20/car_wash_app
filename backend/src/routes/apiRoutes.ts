import express from 'express';
import { registerCustomer, login, adminLogin, adminAccess } from '../controllers/authController';
import { registerVendor, getPlatformStats, getAllVendors, toggleVendorStatus } from '../controllers/adminController';
import { 
  getVendorDashboard, 
  updateBookingStatus, 
  manageSlots, 
  updateVendorProfile,
  getVendorProfile,
  addService, 
  getServices, 
  updateService, 
  deleteService,
  addWorker, 
  getWorkers, 
  updateWorker, 
  deleteWorker,
  updateSlot, 
  deleteSlot,
  searchVendorData,
  getVendorCustomers,
  getVendorTransactions,
  getVendorReports
} from '../controllers/vendorController';
import { 
  searchVendors, 
  getVendorDetails, 
  createBooking, 
  getMyBookings, 
  deleteBooking,
  submitReview,
  addVehicle,
  getVehicles,
  deleteVehicle,
  addAddress,
  getAddresses,
  deleteAddress
} from '../controllers/customerController';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  getInvoiceData
} from '../controllers/paymentController';
import { getHostedPaymentPage } from '../controllers/hostedPaymentController';
import { protect, authorize } from '../middleware/auth';
import notificationRoutes from './notificationRoutes';
import servicePlanRoutes from './servicePlanRoutes';

const router = express.Router();

// NOTIFICATION ROUTES
router.use('/notifications', notificationRoutes);

// SERVICE PLAN ROUTES
router.use('/plans', servicePlanRoutes);

// AUTH ROUTES
router.post('/auth/signup', registerCustomer);
router.post('/auth/login', login);
router.post('/auth/admin-login', adminLogin);
router.post('/auth/admin-access', adminAccess);

// ADMIN ROUTES (Protected)
router.post('/admin/register-vendor', protect, authorize('superAdmin'), registerVendor);
router.get('/admin/stats', protect, authorize('superAdmin'), getPlatformStats);
router.get('/admin/vendors', protect, authorize('superAdmin'), getAllVendors);
router.patch('/admin/vendors/:id/toggle', protect, authorize('superAdmin'), toggleVendorStatus);

// VENDOR ROUTES (Protected)
router.get('/vendor/dashboard', protect, authorize('vendor'), getVendorDashboard);
router.get('/vendor/search', protect, authorize('vendor'), searchVendorData);
router.get('/vendor/customers', protect, authorize('vendor'), getVendorCustomers);
router.get('/vendor/transactions', protect, authorize('vendor'), getVendorTransactions);
router.get('/vendor/reports', protect, authorize('vendor'), getVendorReports);
router.patch('/vendor/bookings/:id/status', protect, authorize('vendor'), updateBookingStatus);

router.route('/vendor/profile')
  .get(protect, authorize('vendor'), getVendorProfile)
  .put(protect, authorize('vendor'), updateVendorProfile);

router.route('/vendor/slots')
  .get(protect, authorize('vendor'), manageSlots)
  .post(protect, authorize('vendor'), manageSlots);
router.route('/vendor/slots/:id')
  .put(protect, authorize('vendor'), updateSlot)
  .delete(protect, authorize('vendor'), deleteSlot);

router.route('/vendor/services')
  .get(protect, authorize('vendor'), getServices)
  .post(protect, authorize('vendor'), addService);
router.route('/vendor/services/:id')
  .put(protect, authorize('vendor'), updateService)
  .delete(protect, authorize('vendor'), deleteService);

router.route('/vendor/workers')
  .get(protect, authorize('vendor'), getWorkers)
  .post(protect, authorize('vendor'), addWorker);
router.route('/vendor/workers/:id')
  .put(protect, authorize('vendor'), updateWorker)
  .delete(protect, authorize('vendor'), deleteWorker);

// CUSTOMER ROUTES (Protected)
router.get('/customer/search', protect, searchVendors);
router.get('/customer/vendors/:vendorId', protect, getVendorDetails);
router.post('/customer/bookings', protect, authorize('customer'), createBooking);
router.get('/customer/my-bookings', protect, authorize('customer'), getMyBookings);
router.delete('/customer/bookings/:id', protect, authorize('customer'), deleteBooking);
router.post('/customer/reviews', protect, authorize('customer'), submitReview);

router.route('/customer/vehicles')
  .get(protect, authorize('customer'), getVehicles)
  .post(protect, authorize('customer'), addVehicle);
router.delete('/customer/vehicles/:vehicleId', protect, authorize('customer'), deleteVehicle);

router.route('/customer/addresses')
  .get(protect, authorize('customer'), getAddresses)
  .post(protect, authorize('customer'), addAddress);
router.delete('/customer/addresses/:addressId', protect, authorize('customer'), deleteAddress);

// PAYMENT ROUTES (Protected)
router.post('/payment/create-order', protect, authorize('customer'), createRazorpayOrder);
router.post('/payment/verify', protect, authorize('customer'), verifyRazorpayPayment);
router.get('/payment/invoice/:bookingId', protect, getInvoiceData);
router.get('/payment/hosted', getHostedPaymentPage);

export default router;
