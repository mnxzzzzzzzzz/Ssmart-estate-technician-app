// API Request and Response Types - Aligned with Mock Data

import {
  MaintenanceJob,
  Technician,
  Building,
  ChatMessage,
  User,
  DashboardStats,
  JobsPerDayData,
  JobsByCategoryData,
  SLAComplianceData,
  Priority,
  JobStatus,
  AvailabilityStatus,
} from './database.types';

// Standard API Response Format
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'tenant' | 'technician' | 'operations' | 'admin';
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

// Job Types
export interface CreateJobRequest {
  issueCategory: string;
  priority: Priority;
  building: string;
  unit: string;
  tenant: string;
  tenantId: string;
  description: string;
  estimatedDuration?: number;
  images?: string[];
}

export interface UpdateJobStatusRequest {
  status: JobStatus;
  notes?: string;
}

export interface AssignJobRequest {
  technicianId: string;
  notes?: string;
}

export interface CompleteJobRequest {
  actualDuration: number;
  actualCost?: number;
  notes?: string;
  images?: string[];
}

export interface JobFilters extends PaginationParams {
  status?: JobStatus;
  priority?: Priority;
  building?: string;
  technicianId?: string;
  tenantId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface JobListResponse {
  jobs: MaintenanceJob[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Technician Types
export interface UpdateTechnicianAvailabilityRequest {
  availability: AvailabilityStatus;
}

export interface UpdateTechnicianLocationRequest {
  latitude: number;
  longitude: number;
}

export interface TechnicianFilters extends PaginationParams {
  availability?: AvailabilityStatus;
  skills?: string[];
  building?: string;
  minRating?: number;
}

export interface TechnicianStatsResponse {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  averageRating: number;
  onTimePercentage: number;
  slaCompliance: number;
  totalHoursWorked: number;
  jobsByCategory: Record<string, number>;
  jobsByPriority: Record<Priority, number>;
}

// Message Types
export interface SendMessageRequest {
  conversationId?: string;
  receiverId?: string;
  ticketId?: string;
  message: string;
  type?: 'text' | 'image' | 'file';
}

export interface MessageFilters extends PaginationParams {
  conversationId?: string;
  ticketId?: string;
  unreadOnly?: boolean;
}

export interface ConversationListResponse {
  conversations: Array<{
    id: string;
    participants: Array<{
      id: string;
      name: string;
      role: string;
      avatar?: string;
    }>;
    lastMessage?: ChatMessage;
    unreadCount: number;
    ticketId?: string;
  }>;
}

// Dashboard Types
export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
  building?: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  jobsPerDay: JobsPerDayData[];
  jobsByCategory: JobsByCategoryData[];
  slaCompliance: SLAComplianceData[];
  recentJobs: MaintenanceJob[];
  activeTechnicians: Technician[];
  criticalBuildings: Building[];
}

// Building Types
export interface BuildingFilters extends PaginationParams {
  slaRisk?: 'low' | 'medium' | 'high';
  minOpenTickets?: number;
  search?: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Notification Types
export interface NotificationFilters extends PaginationParams {
  unreadOnly?: boolean;
  type?: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'tenant' | 'technician' | 'operations' | 'admin';
  iat?: number;
  exp?: number;
}

// Request with User (extended in middleware/auth.middleware.ts)
