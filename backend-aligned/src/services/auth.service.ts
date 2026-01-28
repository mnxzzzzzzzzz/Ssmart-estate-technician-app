// Authentication Service

import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/api.types';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password, role } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        technician: role === 'technician',
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user role matches
    if (user.role !== role) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (user.status !== 'active') {
      throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
    }

    // Verify password
    if (!user.password) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'tenant' | 'technician' | 'operations' | 'admin',
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.status !== 'active') {
        throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
      }

      // Generate new access token
      const token = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role as 'tenant' | 'technician' | 'operations' | 'admin',
      });

      return { token };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  // Register new user (for testing/admin purposes)
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'tenant' | 'technician' | 'operations' | 'admin';
    phoneNumber?: string;
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400, 'USER_EXISTS');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phoneNumber: data.phoneNumber,
        status: 'active',
        emailVerified: false,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // Logout (for future token blacklisting)
  async logout(userId: string): Promise<void> {
    // In a production app, you would blacklist the token here
    // For now, just log the action
    console.log(`User ${userId} logged out`);
  }
}

export default new AuthService();
