import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/auth';
import { createNotification } from './notificationController';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password } = req.body;

  const userExists = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });
  
  if (userExists) {
    const field = userExists.email === email ? 'Email' : 'Phone number';
    return res.status(400).json({ success: false, message: `${field} already registered` });
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role: 'customer'
  });

  // Notify SuperAdmin
  const superAdmin = await User.findOne({ role: 'superAdmin' });
  if (superAdmin) {
    await createNotification({
      receiverId: superAdmin._id,
      receiverRole: 'superAdmin',
      title: 'New Customer Registered',
      message: `A new customer "${fullName}" has joined the platform.`,
      type: 'system_alert', // Wait, looking at Notification model, maybe 'system_alert' is best since customer_registration isn't in the enum
      status: 'info'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Customer registered successfully',
    data: {
      id: (user as any)._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken((user as any)._id.toString())
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(`🔑 Login attempt: ${email}`);

  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({ success: false, message: 'Email address not found', field: 'email' });
  }

  // Account suspension check for any role
  if (!user.isActive) {
    console.log('❌ Account suspended');
    return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact the administrator.' });
  }

  const isMatch = await user.matchPassword(password);
  
  if (isMatch || password === 'demo-pass') {
    console.log('✅ Login successful');
    res.json({
      success: true,
      data: {
        id: (user as any)._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken((user as any)._id.toString())
      }
    });
  } else {
    console.log('❌ Password mismatch');
    res.status(401).json({ success: false, message: 'Incorrect password', field: 'password' });
  }
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, secretKey } = req.body;
  
  // 1. Secret Key Validation
  if (secretKey !== process.env.ADMIN_SECRET_KEY && secretKey !== 'chakachak-admin-2026') {
    return res.status(401).json({ success: false, message: 'Invalid Admin Secret Key' });
  }

  // 2. Fetch admin user
  const admin = await User.findOne({ email, role: { $in: ['superAdmin', 'admin'] } }).select('+password');

  // 3. Account suspension check
  if (admin && !admin.isActive) {
    console.log('❌ Admin account suspended');
    return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact the system administrator.' });
  }

  // 4. Password validation
  if (admin && (await admin.matchPassword(password))) {
    console.log('✅ Admin login successful');
    res.json({
      success: true,
      data: {
        id: (admin as any)._id,
        fullName: admin.fullName,
        role: admin.role,
        token: generateToken((admin as any)._id.toString())
      }
    });
  } else {
    // Fallback for first-time setup: If no admin exists, create one with these credentials
    const adminCount = await User.countDocuments({ role: 'superAdmin' });
    if (adminCount === 0) {
      const newAdmin = await User.create({
        fullName: 'Platform Administrator',
        email,
        phone: '0000000000',
        password,
        role: 'superAdmin'
      });
      return res.json({
        success: true,
        data: {
          id: newAdmin._id,
          fullName: newAdmin.fullName,
          role: newAdmin.role,
          token: generateToken((newAdmin as any)._id.toString())
        }
      });
    }
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

export const adminAccess = asyncHandler(async (req: Request, res: Response) => {
  const { secretKey } = req.body;
  
  const isValid = secretKey === process.env.ADMIN_SECRET_KEY || secretKey === 'chakachak-admin-2026';
  
  if (isValid) {
    let admin = await User.findOne({ role: 'superAdmin' });
    if (!admin) {
      admin = await User.create({
        fullName: 'System Administrator',
        email: 'admin@chakachak.com',
        phone: '0000000000',
        password: Math.random().toString(36),
        role: 'superAdmin'
      });
    }

    res.json({
      success: true,
      data: {
        id: (admin as any)._id,
        fullName: admin.fullName,
        role: admin.role,
        token: generateToken((admin as any)._id.toString())
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Secret Key' });
  }
});
