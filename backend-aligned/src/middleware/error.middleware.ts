// Error Handling Middleware

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api.types';
import { config } from '../config/env';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    code = 'DATABASE_ERROR';
    message = 'Database operation failed';
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found error
export const notFound = (message: string = 'Resource not found'): AppError => {
  return new AppError(message, 404, 'NOT_FOUND');
};

// Validation error
export const validationError = (message: string): AppError => {
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Unauthorized error
export const unauthorized = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, 401, 'UNAUTHORIZED');
};

// Forbidden error
export const forbidden = (message: string = 'Forbidden'): AppError => {
  return new AppError(message, 403, 'FORBIDDEN');
};
