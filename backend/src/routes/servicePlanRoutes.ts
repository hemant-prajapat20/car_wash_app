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

// Vendor Routes
router.route('/vendor')
  .post(protect, authorize('vendor'), createServicePlan)
  .get(protect, authorize('vendor'), getVendorServicePlans);

router.route('/vendor/:id')
  .put(protect, authorize('vendor'), updateServicePlan);

router.patch('/vendor/:id/toggle', protect, authorize('vendor'), toggleServicePlanStatus);
router.post('/vendor/scan', protect, authorize('vendor'), scanPlanQR);

// Customer Routes
router.get('/customer/vendor/:vendorId', protect, getActiveServicePlansByVendor);
router.post('/customer/purchase', protect, authorize('customer'), purchasePlan);
router.get('/customer/my-plans', protect, authorize('customer'), getMyPlans);
router.get('/customer/my-plans/:id', protect, authorize('customer'), getCustomerPlanById);

export default router;
