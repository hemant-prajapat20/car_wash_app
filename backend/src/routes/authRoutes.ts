import { Router } from 'express';
import { 
  signup, 
  login, 
  logout, 
  getProfile,
  createVendor 
} from '../controllers/authController';
import { 
  validateSignup, 
  validateLogin, 
  checkValidation 
} from '../validators/authValidator';
import { verifyJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', validateSignup, checkValidation, signup);
router.post('/login', validateLogin, checkValidation, login);

// Protected routes
router.post('/logout', verifyJWT, logout);
router.get('/profile', verifyJWT, getProfile);

// Admin only routes
router.post(
  '/create-vendor', 
  verifyJWT, 
  authorizeRoles('admin'), 
  validateSignup, 
  checkValidation, 
  createVendor
);

export default router;
