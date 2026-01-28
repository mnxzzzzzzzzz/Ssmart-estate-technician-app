// Dashboard Service

import prisma from '../config/database';
import {
  DashboardStats,
  JobsPerDayData,
  JobsByCategoryData,
  SLAComplianceData,
} from '../types/database.types';
import { DashboardResponse, DashboardFilters } from '../types/api.types';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';
import { isSLABreached } from '../utils/sla.utils';

export class DashboardService {
  // Get dashboard data
  async getDashboardData(filters: DashboardFilters): Promise<DashboardResponse> {
    const [stats, jobsPerDay, jobsByCategory, slaCompliance, recentJobs, activeTechnicians] =
      await Promise.all([
        this.getStats(filters),
        this.getJobsPerDay(filters),
        this.getJobsByCategory(filters),
        this.getSLACompliance(filters),
        this.getRecentJobs(filters),
        this.getActiveTechnicians(filters),
      ]);

    return {
      stats,
      jobsPerDay,
      jobsByCategory,
      slaCompliance,
      recentJobs,
      activeTechnicians,
      criticalBuildings: [], // Would need to implement building risk calculation
    };
  }

  // Get dashboard statistics
  async getStats(filters: DashboardFilters): Promise<DashboardStats> {
    const where: any = {};
    if (filters.building) where.building = filters.building;

    // Total active jobs
    const totalActiveJobs = await prisma.maintenanceJob.count({
      where: {
        ...where,
        status: { in: ['pending', 'assigned', 'in-progress'] },
      },
    });

    // Jobs due today
    const today = new Date();
    const jobsDueToday = await prisma.maintenanceJob.count({
      where: {
        ...where,
        slaDeadline: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        status: { not: 'completed' },
      },
    });

    // SLA breaches
    const allJobs = await prisma.maintenanceJob.findMany({
      where: {
        ...where,
        status: 'completed',
      },
      select: {
        slaDeadline: true,
        completedAt: true,
      },
    });

    const slaBreaches = allJobs.filter((job) =>
      isSLABreached(job.slaDeadline, job.completedAt || undefined)
    ).length;

    // Available technicians
    const availableTechnicians = await prisma.technician.count({
      where: { availability: 'available' },
    });

    // Total tickets all time
    const totalTicketsAllTime = await prisma.maintenanceJob.count();

    // Calculate average response and resolution times
    const completedJobs = await prisma.maintenanceJob.findMany({
      where: {
        ...where,
        status: 'completed',
        actualDuration: { not: null },
      },
      select: { actualDuration: true },
    });

    const avgDuration =
      completedJobs.length > 0
        ? completedJobs.reduce((sum, job) => sum + (job.actualDuration || 0), 0) /
          completedJobs.length
        : 0;

    const avgResponseTime = `${(avgDuration / 60).toFixed(1)} hrs`;
    const avgResolutionTime = `${(avgDuration / 60).toFixed(1)} hrs`;

    // Overall SLA compliance
    const totalCompleted = allJobs.length;
    const overallSlaCompliance =
      totalCompleted > 0 ? ((totalCompleted - slaBreaches) / totalCompleted) * 100 : 100;

    return {
      totalActiveJobs,
      jobsDueToday,
      slaBreaches,
      availableTechnicians,
      totalTicketsAllTime,
      avgResponseTime,
      avgResolutionTime,
      overallSlaCompliance,
    };
  }

  // Get jobs per day for last 7 days
  async getJobsPerDay(filters: DashboardFilters): Promise<JobsPerDayData[]> {
    const days = 7;
    const data: JobsPerDayData[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const count = await prisma.maintenanceJob.count({
        where: {
          ...(filters.building && { building: filters.building }),
          createdAt: {
            gte: startOfDay(date),
            lte: endOfDay(date),
          },
        },
      });

      data.push({
        date: format(date, 'EEE'),
        jobs: count,
      });
    }

    return data;
  }

  // Get jobs by category
  async getJobsByCategory(filters: DashboardFilters): Promise<JobsByCategoryData[]> {
    const where: any = {};
    if (filters.building) where.building = filters.building;

    const jobsByCategory = await prisma.maintenanceJob.groupBy({
      by: ['issueCategory'],
      where,
      _count: true,
    });

    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

    return jobsByCategory.map((item, index) => ({
      category: item.issueCategory,
      count: item._count,
      fill: colors[index % colors.length],
    }));
  }

  // Get SLA compliance for last 6 months
  async getSLACompliance(filters: DashboardFilters): Promise<SLAComplianceData[]> {
    const months = 6;
    const data: SLAComplianceData[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subDays(new Date(), i * 30);
      const monthStart = startOfDay(date);
      const monthEnd = endOfDay(date);

      const jobs = await prisma.maintenanceJob.findMany({
        where: {
          ...(filters.building && { building: filters.building }),
          completedAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        select: {
          slaDeadline: true,
          completedAt: true,
        },
      });

      const breaches = jobs.filter((job) =>
        isSLABreached(job.slaDeadline, job.completedAt || undefined)
      ).length;

      const compliance = jobs.length > 0 ? ((jobs.length - breaches) / jobs.length) * 100 : 100;

      data.push({
        month: format(date, 'MMM'),
        compliance,
      });
    }

    return data;
  }

  // Get recent jobs
  async getRecentJobs(filters: DashboardFilters) {
    const where: any = {};
    if (filters.building) where.building = filters.building;

    const jobs = await prisma.maintenanceJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return jobs;
  }

  // Get active technicians
  async getActiveTechnicians(filters: DashboardFilters) {
    const where: any = {
      availability: { in: ['available', 'busy'] },
    };

    if (filters.building) {
      where.assignedBuildings = { has: filters.building };
    }

    const technicians = await prisma.technician.findMany({
      where,
      orderBy: { currentWorkload: 'desc' },
      take: 10,
    });

    return technicians;
  }
}

export default new DashboardService();
