import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateVendorId } from '../utils/generateVendorId';

const generateToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d',
  });
};

// Public Signup - Customers
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(409, "User with this email already exists.");
    }

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      role: 'customer',
    });

    const createdUser = await User.findById(user._id).select("-password");
    const token = generateToken(createdUser?._id);

    return res
      .status(201)
      .cookie("accessToken", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      .json(
        new ApiResponse(201, { user: createdUser, token }, "Customer registered successfully")
      );
  } catch (error) {
    next(error);
  }
};

// SuperAdmin Only - Register Vendor with Secure ID
export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, phoneNumber, password, companyName, businessLocation } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new ApiError(409, "Vendor with this email already exists.");
    }

    // Generate highly secure unique Vendor ID
    const vendorId = await generateVendorId();

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      companyName,
      businessLocation,
      vendorId, // Linked for dashboard isolation
      role: 'vendor',
      isActive: true,
    });

    const createdVendor = await User.findById(user._id).select("-password");

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdVendor, "Vendor registered successfully with secure ID")
      );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(404, "No account found with this email.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account has been deactivated. Please contact support.");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password.");
    }

    const loggedInUser = await User.findById(user._id).select("-password");
    const token = generateToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      .json(
        new ApiResponse(200, { user: loggedInUser, token }, "Login successful")
      );
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res
      .status(200)
      .clearCookie("accessToken")
      .json(new ApiResponse(200, {}, "Logout successful"));
  } catch (error) {
    next(error);
  }
};
