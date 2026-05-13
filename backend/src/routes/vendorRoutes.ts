import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  addSlot, getSlots,
  addService, getServices,
  addWorker, getWorkers
} from '../controllers/vendorController';

const router = express.Router();

router.use(protect);
router.use(authorize('vendor'));

// Slots
router.route('/slots').get(getSlots).post(addSlot);

// Services
router.route('/services').get(getServices).post(addService);

// Workers
router.route('/workers').get(getWorkers).post(addWorker);

export default router;
