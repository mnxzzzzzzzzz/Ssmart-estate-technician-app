// JWT Utility Functions

import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types/api.types';

// Generate access token
export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiresIn,
  });
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.refreshTokenSecret) as JWTPayload;
};

// Decode token without verification
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
