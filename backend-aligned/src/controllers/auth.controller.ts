// Authentication Controller

import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { LoginRequest, RefreshTokenRequest, ApiResponse } from '../types/api.types';
import { asyncHandler } from '../middleware/error.middleware';

export class AuthController {
  // Login
  login = asyncHandler(async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const data: LoginRequest = req.body;
    const result = await authService.login(data);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  // Refresh token
  refreshToken = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { refreshToken }: RefreshTokenRequest = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Register (for testing/admin)
  register = asyncHandler(async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const data = req.body;
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  // Logout
  logout = asyncHandler(async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const userId = req.user?.userId;

    if (userId) {
      await authService.logout(userId);
    }

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  });

  // Get current user
  getCurrentUser = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    }
  );
}

export default new AuthController();
