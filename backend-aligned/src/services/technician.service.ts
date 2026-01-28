// Technician Service

import prisma from '../config/database';
import { Technician } from '../types/database.types';
import {
  TechnicianFilters,
  UpdateTechnicianAvailabilityRequest,
  UpdateTechnicianLocationRequest,
  TechnicianStatsResponse,
} from '../types/api.types';
import { AppError } from '../middleware/error.middleware';
import { parsePagination } from '../utils/pagination.utils';

export class TechnicianService {
  // Get all technicians with filters
  async getTechnicians(filters: TechnicianFilters) {
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};

    if (filters.availability) where.availability = filters.availability;
    if (filters.building) where.assignedBuildings = { has: filters.building };
    if (filters.minRating) where.rating = { gte: filters.minRating };
    if (filters.skills && filters.skills.length > 0) {
      where.skills = { hasSome: filters.skills };
    }

    const [technicians, total] = await Promise.all([
      prisma.technician.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.technician.count({ where }),
    ]);

    return {
      technicians: technicians as Technician[],
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  // Get technician by ID
  async getTechnicianById(id: string): Promise<Technician> {
    const technician = await prisma.technician.findUnique({
      where: { id },
      include: {
        assignedJobs: {
          where: { status: { in: ['assigned', 'in-progress'] } },
        },
      },
    });

    if (!technician) {
      throw new AppError('Technician not found', 404, 'TECHNICIAN_NOT_FOUND');
    }

    return technician as Technician;
  }

  // Get technician by user ID
  async getTechnicianByUserId(userId: string): Promise<Technician> {
    const technician = await prisma.technician.findUnique({
      where: { userId },
    });

    if (!technician) {
      throw new AppError('Technician not found', 404, 'TECHNICIAN_NOT_FOUND');
    }

    return technician as Technician;
  }

  // Update technician availability
  async updateAvailability(
    id: string,
    data: UpdateTechnicianAvailabilityRequest
  ): Promise<Technician> {
    await this.getTechnicianById(id); // Check if exists

    const technician = await prisma.technician.update({
      where: { id },
      data: { availability: data.availability },
    });

    return technician as Technician;
  }

  // Update technician location
  async updateLocation(id: string, data: UpdateTechnicianLocationRequest): Promise<Technician> {
    await this.getTechnicianById(id); // Check if exists

    const technician = await prisma.technician.update({
      where: { id },
      data: {
        currentLatitude: data.latitude,
        currentLongitude: data.longitude,
        locationUpdatedAt: new Date(),
      },
    });

    return technician as Technician;
  }

  // Get technician statistics
  async getTechnicianStats(id: string): Promise<TechnicianStatsResponse> {
    const technician = await this.getTechnicianById(id);

    // Get job counts
    const [totalJobs, completedJobs, activeJobs] = await Promise.all([
      prisma.maintenanceJob.count({
        where: { technicianId: id },
      }),
      prisma.maintenanceJob.count({
        where: { technicianId: id, status: 'completed' },
      }),
      prisma.maintenanceJob.count({
        where: { technicianId: id, status: { in: ['assigned', 'in-progress'] } },
      }),
    ]);

    // Get jobs by category
    const jobsByCategory = await prisma.maintenanceJob.groupBy({
      by: ['issueCategory'],
      where: { technicianId: id },
      _count: true,
    });

    const categoryMap = jobsByCategory.reduce((acc, item) => {
      acc[item.issueCategory] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Get jobs by priority
    const jobsByPriority = await prisma.maintenanceJob.groupBy({
      by: ['priority'],
      where: { technicianId: id },
      _count: true,
    });

    const priorityMap = jobsByPriority.reduce((acc, item) => {
      acc[item.priority as any] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total hours worked
    const timeTracking = await prisma.timeTracking.findMany({
      where: { technicianId: id, endTime: { not: null } },
    });

    const totalMinutes = timeTracking.reduce((sum, track) => sum + (track.duration || 0), 0);
    const totalHoursWorked = totalMinutes / 60;

    return {
      totalJobs,
      completedJobs,
      activeJobs,
      averageRating: technician.rating || 0,
      onTimePercentage: technician.onTimePercentage,
      slaCompliance: technician.slaCompliance,
      totalHoursWorked,
      jobsByCategory: categoryMap,
      jobsByPriority: priorityMap as any,
    };
  }

  // Get available technicians for a job
  async getAvailableTechnicians(building: string, skills?: string[]) {
    const where: any = {
      availability: 'available',
      assignedBuildings: { has: building },
    };

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    const technicians = await prisma.technician.findMany({
      where,
      orderBy: [{ currentWorkload: 'asc' }, { rating: 'desc' }],
    });

    return technicians as Technician[];
  }
}

export default new TechnicianService();
