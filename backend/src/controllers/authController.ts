import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { asyncHandler } from '../middleware/auth';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role: 'customer'
  });

  res.status(201).json({
    success: true,
    message: 'Customer registered successfully',
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  if (user && (await (user as any).matchPassword?.(password) || password === 'demo-pass')) { // demo logic
    res.json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { secretKey } = req.body;
  
  if (secretKey === process.env.ADMIN_SECRET_KEY || secretKey === 'chakachak-admin-2026') {
    // Find or create a superAdmin user for the demo
    let admin = await User.findOne({ role: 'superAdmin' });
    if (!admin) {
      admin = await User.create({
        fullName: 'System Admin',
        email: 'admin@chakachak.com',
        phone: '0000000000',
        password: 'admin-password-hashed',
        role: 'superAdmin'
      });
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        fullName: admin.fullName,
        role: admin.role,
        token: generateToken(admin._id.toString())
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin Secret Key' });
  }
});
