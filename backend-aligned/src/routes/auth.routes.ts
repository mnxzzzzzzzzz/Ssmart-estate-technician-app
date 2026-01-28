// Authentication Routes

import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role')
    .isIn(['tenant', 'technician', 'operations', 'admin'])
    .withMessage('Valid role is required'),
];

// Register validation
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .isIn(['tenant', 'technician', 'operations', 'admin'])
    .withMessage('Valid role is required'),
];

// Refresh token validation
const refreshTokenValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

// Routes
router.post('/login', authRateLimiter, validate(loginValidation), authController.login);
router.post('/refresh', validate(refreshTokenValidation), authController.refreshToken);
router.post('/register', validate(registerValidation), authController.register);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
