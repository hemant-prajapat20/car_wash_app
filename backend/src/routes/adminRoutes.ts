import { Router } from 'express';
import { 
  adminLogin,
  getAllVendors, 
  getAllCustomers, 
  toggleVendorStatus, 
  deleteVendor, 
  getStats 
} from '../controllers/adminController';
import { createVendor } from '../controllers/authController';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Public Admin Route (Secret Key Login)
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(verifyJWT);
router.use(authorizeRoles('superAdmin', 'admin'));

router.get('/stats', getStats);
router.get('/vendors', getAllVendors);
router.get('/customers', getAllCustomers);
router.post('/register-vendor', createVendor);
router.patch('/vendors/:vendorId/toggle', toggleVendorStatus);
router.delete('/vendors/:vendorId', deleteVendor);

export default router;
