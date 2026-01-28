// Dashboard Controller

import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';
import { DashboardFilters, ApiResponse } from '../types/api.types';
import { asyncHandler } from '../middleware/error.middleware';

export class DashboardController {
  // Get dashboard data
  getDashboardData = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: DashboardFilters = req.query;
      const result = await dashboardService.getDashboardData(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get dashboard stats only
  getStats = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: DashboardFilters = req.query;
      const result = await dashboardService.getStats(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get jobs per day
  getJobsPerDay = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: DashboardFilters = req.query;
      const result = await dashboardService.getJobsPerDay(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get jobs by category
  getJobsByCategory = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: DashboardFilters = req.query;
      const result = await dashboardService.getJobsByCategory(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get SLA compliance
  getSLACompliance = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: DashboardFilters = req.query;
      const result = await dashboardService.getSLACompliance(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
}

export default new DashboardController();
