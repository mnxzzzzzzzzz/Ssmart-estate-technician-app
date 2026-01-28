// Application Constants - Aligned with Mock Data

import { Priority, JobStatus, AvailabilityStatus, SLARisk } from '../types/database.types';

// Priority levels
export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

// Job statuses
export const JOB_STATUSES: JobStatus[] = ['pending', 'assigned', 'in-progress', 'completed', 'escalated'];

// Availability statuses
export const AVAILABILITY_STATUSES: AvailabilityStatus[] = ['available', 'busy', 'offline'];

// SLA risk levels
export const SLA_RISKS: SLARisk[] = ['low', 'medium', 'high'];

// User roles
export const USER_ROLES = ['tenant', 'technician', 'operations', 'admin'] as const;

// Message sender roles
export const SENDER_ROLES = ['operations', 'technician', 'tenant'] as const;

// SLA Configuration (in minutes)
export const SLA_CONFIG = {
  urgent: { responseTime: 30, resolutionTime: 120 },
  high: { responseTime: 60, resolutionTime: 240 },
  medium: { responseTime: 120, resolutionTime: 480 },
  low: { responseTime: 240, resolutionTime: 1440 },
};

// Job categories
export const JOB_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Appliance',
  'Structural',
  'Carpentry',
  'Maintenance',
  'Landscaping',
  'Security',
] as const;

// Notification types
export const NOTIFICATION_TYPES = [
  'job_assigned',
  'job_updated',
  'message_received',
  'sla_warning',
  'system',
] as const;

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

// Technician defaults
export const DEFAULT_MAX_WORKLOAD = 6;
export const DEFAULT_HOURLY_RATE = 75;

// Time formats
export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export default {
  PRIORITIES,
  JOB_STATUSES,
  AVAILABILITY_STATUSES,
  SLA_RISKS,
  USER_ROLES,
  SENDER_ROLES,
  SLA_CONFIG,
  JOB_CATEGORIES,
  NOTIFICATION_TYPES,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_FILE_TYPES,
  DEFAULT_MAX_WORKLOAD,
  DEFAULT_HOURLY_RATE,
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
};
