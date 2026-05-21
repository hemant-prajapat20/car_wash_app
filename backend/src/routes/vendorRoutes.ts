import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  addSlot, getSlots,
  addService, getServices, updateService, deleteService,
  addWorker, getWorkers, updateWorker, deleteWorker,
  uploadGalleryImages, deleteGalleryImage, updateAvailability
} from '../controllers/vendorController';
import { uploadImage } from '../middleware/upload';

const router = express.Router();

router.use(protect);
router.use(authorize('vendor'));

// Availability
router.patch('/availability', updateAvailability);

// Gallery
router.post('/gallery', uploadImage.array('images', 5), uploadGalleryImages);
router.delete('/gallery', deleteGalleryImage);

// Slots
router.route('/slots').get(getSlots).post(addSlot);

// Services
router.route('/services').get(getServices).post(addService);

// Workers
router.route('/workers').get(getWorkers).post(addWorker);

export default router;
