// SLA Calculation Utilities

import { Priority, SLARisk } from '../types/database.types';
import { SLA_CONFIG } from '../config/constants';
import { addMinutes, differenceInMinutes, isBefore } from 'date-fns';

// Calculate SLA deadline based on priority
export const calculateSLADeadline = (priority: Priority, createdAt: Date = new Date()): Date => {
  const config = SLA_CONFIG[priority];
  return addMinutes(createdAt, config.resolutionTime);
};

// Calculate response deadline
export const calculateResponseDeadline = (priority: Priority, createdAt: Date = new Date()): Date => {
  const config = SLA_CONFIG[priority];
  return addMinutes(createdAt, config.responseTime);
};

// Check if SLA is breached
export const isSLABreached = (deadline: Date, completedAt?: Date): boolean => {
  const checkDate = completedAt || new Date();
  return isBefore(deadline, checkDate);
};

// Calculate remaining time until SLA breach (in minutes)
export const calculateRemainingTime = (deadline: Date): number => {
  const now = new Date();
  const remaining = differenceInMinutes(deadline, now);
  return Math.max(0, remaining);
};

// Calculate SLA risk level based on remaining time
export const calculateSLARisk = (deadline: Date): SLARisk => {
  const remainingMinutes = calculateRemainingTime(deadline);
  const totalMinutes = differenceInMinutes(deadline, new Date(deadline.getTime() - 24 * 60 * 60 * 1000));
  const percentageRemaining = (remainingMinutes / totalMinutes) * 100;

  if (percentageRemaining > 50) return 'low';
  if (percentageRemaining > 25) return 'medium';
  return 'high';
};

// Calculate SLA compliance percentage
export const calculateSLACompliance = (totalJobs: number, breachedJobs: number): number => {
  if (totalJobs === 0) return 100;
  return ((totalJobs - breachedJobs) / totalJobs) * 100;
};

// Format time remaining as human-readable string
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};
