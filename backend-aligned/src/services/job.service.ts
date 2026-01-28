// Job Service - Aligned with Mock Data

import prisma from '../config/database';
import { MaintenanceJob } from '../types/database.types';
import {
  CreateJobRequest,
  UpdateJobStatusRequest,
  AssignJobRequest,
  CompleteJobRequest,
  JobFilters,
  JobListResponse,
} from '../types/api.types';
import { AppError } from '../middleware/error.middleware';
import { parsePagination, calculatePaginationMeta } from '../utils/pagination.utils';
import { generateTicketId } from '../utils/ticketId.utils';
import { calculateSLADeadline } from '../utils/sla.utils';

export class JobService {
  // Get all jobs with filters
  async getJobs(filters: JobFilters): Promise<JobListResponse> {
    const { page, limit, skip } = parsePagination(filters);

    // Build where clause
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.building) where.building = filters.building;
    if (filters.technicianId) where.technicianId = filters.technicianId;
    if (filters.tenantId) where.tenantId = filters.tenantId;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    if (filters.search) {
      where.OR = [
        { ticketId: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { issueCategory: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get jobs and total count
    const [jobs, total] = await Promise.all([
      prisma.maintenanceJob.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.maintenanceJob.count({ where }),
    ]);

    const meta = calculatePaginationMeta(total, page, limit);

    return {
      jobs: jobs as MaintenanceJob[],
      ...meta,
    };
  }

  // Get job by ID
  async getJobById(id: string): Promise<MaintenanceJob> {
    const job = await prisma.maintenanceJob.findUnique({
      where: { id },
      include: {
        technician: true,
        timeTracking: true,
        materials: true,
      },
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    return job as MaintenanceJob;
  }

  // Get job by ticket ID
  async getJobByTicketId(ticketId: string): Promise<MaintenanceJob> {
    const job = await prisma.maintenanceJob.findUnique({
      where: { ticketId },
      include: {
        technician: true,
        timeTracking: true,
        materials: true,
      },
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    return job as MaintenanceJob;
  }

  // Create new job
  async createJob(data: CreateJobRequest): Promise<MaintenanceJob> {
    // Get last ticket number for this year
    const year = new Date().getFullYear();
    const lastJob = await prisma.maintenanceJob.findFirst({
      where: {
        ticketId: {
          startsWith: `TKT-${year}-`,
        },
      },
      orderBy: { ticketId: 'desc' },
    });

    let lastNumber = 0;
    if (lastJob) {
      const match = lastJob.ticketId.match(/TKT-\d{4}-(\d{3})/);
      if (match) lastNumber = parseInt(match[1], 10);
    }

    const ticketId = await generateTicketId(lastNumber);
    const slaDeadline = calculateSLADeadline(data.priority);

    // Create job
    const job = await prisma.maintenanceJob.create({
      data: {
        ticketId,
        issueCategory: data.issueCategory,
        aiConfidence: 0.85, // Default AI confidence
        priority: data.priority,
        building: data.building,
        unit: data.unit,
        tenant: data.tenant,
        tenantId: data.tenantId,
        description: data.description,
        estimatedDuration: data.estimatedDuration,
        images: data.images || [],
        slaDeadline,
        status: 'pending',
      },
    });

    return job as MaintenanceJob;
  }

  // Update job status
  async updateJobStatus(id: string, data: UpdateJobStatusRequest): Promise<MaintenanceJob> {
    const job = await this.getJobById(id);

    const updateData: any = {
      status: data.status,
    };

    // If completing job, set completedAt
    if (data.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updatedJob = await prisma.maintenanceJob.update({
      where: { id },
      data: updateData,
    });

    return updatedJob as MaintenanceJob;
  }

  // Assign job to technician
  async assignJob(id: string, data: AssignJobRequest): Promise<MaintenanceJob> {
    const job = await this.getJobById(id);

    // Get technician
    const technician = await prisma.technician.findUnique({
      where: { id: data.technicianId },
    });

    if (!technician) {
      throw new AppError('Technician not found', 404, 'TECHNICIAN_NOT_FOUND');
    }

    // Update job
    const updatedJob = await prisma.maintenanceJob.update({
      where: { id },
      data: {
        technicianId: data.technicianId,
        assignedTechnician: technician.name,
        status: 'assigned',
      },
    });

    // Create assignment record
    await prisma.jobAssignment.create({
      data: {
        jobId: id,
        technicianId: data.technicianId,
        assignedBy: 'system', // Should be from auth context
        assignedAt: new Date(),
      },
    });

    // Update technician workload
    await prisma.technician.update({
      where: { id: data.technicianId },
      data: {
        currentWorkload: { increment: 1 },
      },
    });

    return updatedJob as MaintenanceJob;
  }

  // Complete job
  async completeJob(id: string, data: CompleteJobRequest): Promise<MaintenanceJob> {
    const job = await this.getJobById(id);

    const updatedJob = await prisma.maintenanceJob.update({
      where: { id },
      data: {
        status: 'completed',
        actualDuration: data.actualDuration,
        actualCost: data.actualCost,
        completedAt: new Date(),
        images: data.images ? [...job.images, ...data.images] : job.images,
      },
    });

    // Update technician workload
    if (job.technicianId) {
      await prisma.technician.update({
        where: { id: job.technicianId },
        data: {
          currentWorkload: { decrement: 1 },
          totalJobsCompleted: { increment: 1 },
        },
      });
    }

    return updatedJob as MaintenanceJob;
  }

  // Delete job
  async deleteJob(id: string): Promise<void> {
    await this.getJobById(id); // Check if exists

    await prisma.maintenanceJob.delete({
      where: { id },
    });
  }
}

export default new JobService();
