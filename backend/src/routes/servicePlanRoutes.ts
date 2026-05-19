import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  createServicePlan,
  getVendorServicePlans,
  updateServicePlan,
  toggleServicePlanStatus,
  scanPlanQR,
  getActiveServicePlansByVendor,
  purchasePlan,
  getMyPlans,
  getCustomerPlanById
} from '../controllers/servicePlanController';

const router = express.Router();

// ─── VENDOR ROUTES ──────────────────────────────────────────────────────────

// Static paths MUST come before wildcard /:id routes
router.post('/vendor/scan', protect, authorize('vendor'), scanPlanQR);

router.route('/vendor')
  .post(protect, authorize('vendor'), createServicePlan)
  .get(protect, authorize('vendor'), getVendorServicePlans);

// Wildcard routes last
router.patch('/vendor/:id/toggle', protect, authorize('vendor'), toggleServicePlanStatus);
router.route('/vendor/:id')
  .put(protect, authorize('vendor'), updateServicePlan);

// ─── CUSTOMER ROUTES ─────────────────────────────────────────────────────────

router.get('/customer/vendor/:vendorId', protect, getActiveServicePlansByVendor);
router.post('/customer/purchase', protect, purchasePlan);
router.get('/customer/my-plans', protect, getMyPlans);
router.get('/customer/my-plans/:id', protect, getCustomerPlanById);

export default router;
