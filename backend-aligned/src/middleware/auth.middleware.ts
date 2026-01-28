// Authentication Middleware

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types/api.types';
import { ApiResponse } from '../types/api.types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Verify JWT token
export const authenticate = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// Authorize specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
        req.user = decoded;
      } catch (error) {
        // Token invalid, but continue without user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
