// Technician Controller

import { Request, Response, NextFunction } from 'express';
import technicianService from '../services/technician.service';
import {
  TechnicianFilters,
  UpdateTechnicianAvailabilityRequest,
  UpdateTechnicianLocationRequest,
  ApiResponse,
} from '../types/api.types';
import { asyncHandler } from '../middleware/error.middleware';

export class TechnicianController {
  // Get all technicians
  getTechnicians = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: TechnicianFilters = req.query;
      const result = await technicianService.getTechnicians(filters);

      res.status(200).json({
        success: true,
        data: result.technicians,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          hasMore: result.hasMore,
        },
      });
    }
  );

  // Get technician by ID
  getTechnicianById = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const result = await technicianService.getTechnicianById(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get current technician (from auth context)
  getCurrentTechnician = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const result = await technicianService.getTechnicianByUserId(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Update availability
  updateAvailability = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const data: UpdateTechnicianAvailabilityRequest = req.body;
      const result = await technicianService.updateAvailability(id, data);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Update location
  updateLocation = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const data: UpdateTechnicianLocationRequest = req.body;
      const result = await technicianService.updateLocation(id, data);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get technician stats
  getTechnicianStats = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const result = await technicianService.getTechnicianStats(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get available technicians
  getAvailableTechnicians = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { building, skills } = req.query;
      const result = await technicianService.getAvailableTechnicians(
        building as string,
        skills ? (skills as string).split(',') : undefined
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
}

export default new TechnicianController();
