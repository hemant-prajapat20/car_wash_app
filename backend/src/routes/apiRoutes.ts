import express from 'express';
import { registerCustomer, login, adminLogin } from '../controllers/authController';
import { registerVendor, getPlatformStats, getAllVendors, toggleVendorStatus } from '../controllers/adminController';
import { getVendorDashboard, updateBookingStatus, manageSlots, updateVendorProfile } from '../controllers/vendorController';
import { searchVendors, createBooking, getMyBookings, submitReview } from '../controllers/customerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// AUTH ROUTES
router.post('/auth/signup', registerCustomer);
router.post('/auth/login', login);
router.post('/auth/admin-login', adminLogin);

// ADMIN ROUTES (Protected)
router.post('/admin/register-vendor', protect, authorize('superAdmin'), registerVendor);
router.get('/admin/stats', protect, authorize('superAdmin'), getPlatformStats);
router.get('/admin/vendors', protect, authorize('superAdmin'), getAllVendors);
router.patch('/admin/vendors/:id/toggle', protect, authorize('superAdmin'), toggleVendorStatus);

// VENDOR ROUTES (Protected)
router.get('/vendor/dashboard', protect, authorize('vendor'), getVendorDashboard);
router.patch('/vendor/bookings/:id/status', protect, authorize('vendor'), updateBookingStatus);
router.route('/vendor/slots')
  .get(protect, authorize('vendor'), manageSlots)
  .post(protect, authorize('vendor'), manageSlots);
router.put('/vendor/profile', protect, authorize('vendor'), updateVendorProfile);

// CUSTOMER ROUTES (Protected)
router.get('/customer/search', protect, searchVendors);
router.post('/customer/bookings', protect, authorize('customer'), createBooking);
router.get('/customer/my-bookings', protect, authorize('customer'), getMyBookings);
router.post('/customer/reviews', protect, authorize('customer'), submitReview);

export default router;
