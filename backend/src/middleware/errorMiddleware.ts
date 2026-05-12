import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Fallback for non-ApiError errors
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: process.env.NODE_ENV === 'development' ? [err.message] : []
  });
};
