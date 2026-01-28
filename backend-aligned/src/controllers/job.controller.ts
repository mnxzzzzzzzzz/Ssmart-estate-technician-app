// Job Controller

import { Request, Response, NextFunction } from 'express';
import jobService from '../services/job.service';
import {
  CreateJobRequest,
  UpdateJobStatusRequest,
  AssignJobRequest,
  CompleteJobRequest,
  JobFilters,
  ApiResponse,
} from '../types/api.types';
import { asyncHandler } from '../middleware/error.middleware';

export class JobController {
  // Get all jobs
  getJobs = asyncHandler(async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const filters: JobFilters = req.query;
    const result = await jobService.getJobs(filters);

    res.status(200).json({
      success: true,
      data: result.jobs,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        hasMore: result.hasMore,
      },
    });
  });

  // Get job by ID
  getJobById = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const result = await jobService.getJobById(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get job by ticket ID
  getJobByTicketId = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { ticketId } = req.params;
      const result = await jobService.getJobByTicketId(ticketId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Create job
  createJob = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const data: CreateJobRequest = req.body;
      const result = await jobService.createJob(data);

      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );

  // Update job status
  updateJobStatus = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const data: UpdateJobStatusRequest = req.body;
      const result = await jobService.updateJobStatus(id, data);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Assign job
  assignJob = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const data: AssignJobRequest = req.body;
      const result = await jobService.assignJob(id, data);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Complete job
  completeJob = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const data: CompleteJobRequest = req.body;
      const result = await jobService.completeJob(id, data);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Delete job
  deleteJob = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      await jobService.deleteJob(id);

      res.status(200).json({
        success: true,
        data: { message: 'Job deleted successfully' },
      });
    }
  );
}

export default new JobController();
