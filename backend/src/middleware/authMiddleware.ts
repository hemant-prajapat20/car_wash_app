import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || '');

    // Handle Virtual SuperAdmin
    if (decodedToken?._id === 'SUPER_ADMIN_ID') {
      req.user = {
        _id: 'SUPER_ADMIN_ID',
        fullName: 'Platform SuperAdmin',
        email: 'admin@aquawash.saas',
        role: 'superAdmin',
        isActive: true,
      };
      return next();
    }

    // Handle Database Users
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Role: ${req.user?.role} is not allowed to access this resource`
      );
    }
    next();
  };
};
