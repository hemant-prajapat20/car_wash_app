import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import jwt from 'jsonwebtoken';

const generateToken = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d',
  });
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { secretKey } = req.body;

    if (!secretKey) {
      throw new ApiError(400, "Admin secret key is required");
    }

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      throw new ApiError(401, "Invalid Admin Secret Key. Access Denied.");
    }

    // Generate a virtual SuperAdmin user object
    const superAdmin = {
      _id: 'SUPER_ADMIN_ID',
      fullName: 'Platform SuperAdmin',
      email: 'admin@aquawash.saas',
      role: 'superAdmin',
      isActive: true,
    };

    const token = generateToken({ _id: superAdmin._id, role: superAdmin.role });

    return res
      .status(200)
      .cookie("accessToken", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      .json(
        new ApiResponse(
          200, 
          { user: superAdmin, token }, 
          "SuperAdmin authenticated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, vendors, "Vendors fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, customers, "Customers fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const toggleVendorStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findById(vendorId);
    
    if (!vendor || vendor.role !== 'vendor') {
      throw new ApiError(404, "Vendor not found");
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    return res
      .status(200)
      .json(new ApiResponse(200, vendor, `Vendor ${vendor.isActive ? 'activated' : 'deactivated'} successfully`));
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOneAndDelete({ _id: vendorId, role: 'vendor' });
    
    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Vendor deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const activeVendors = await User.countDocuments({ role: 'vendor', isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    return res
      .status(200)
      .json(new ApiResponse(200, {
        totalVendors,
        activeVendors,
        totalCustomers,
        platformRevenue: 125400,
      }, "Platform stats fetched successfully"));
  } catch (error) {
    next(error);
  }
};
