// Validation Middleware using express-validator

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiResponse } from '../types/api.types';

// Validate request
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
        },
      });
      return;
    }

    next();
  };
};
