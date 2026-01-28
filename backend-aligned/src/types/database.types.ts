// ALIGNED WITH mockData.ts.txt STRUCTURE
// All types match existing mock data exactly

// Priority levels - EXACT match with mock data
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Job status - EXACT match with mock data
export type JobStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'escalated';

// Availability status - EXACT match with mock data
export type AvailabilityStatus = 'available' | 'busy' | 'offline';

// SLA risk levels - EXACT match with mock data
export type SLARisk = 'low' | 'medium' | 'high';

// User roles - EXACT match with mock data
export type UserRole = 'tenant' | 'technician' | 'operations' | 'admin';

// User status
export type UserStatus = 'active' | 'inactive';

// Message sender roles
export type SenderRole = 'operations' | 'technician' | 'tenant';

// Message status
export type MessageStatus = 'sent' | 'delivered' | 'read';

// Message type
export type MessageType = 'text' | 'image' | 'file';

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// MaintenanceJob - EXACTLY matching mock data structure
export interface MaintenanceJob extends BaseEntity {
  ticketId: string; // e.g., "TKT-2024-001"
  issueCategory: string;
  aiConfidence: number;
  priority: Priority;
  building: string;
  unit: string;
  tenant: string;
  assignedTechnician: string | null;
  technicianId: string | null;
  slaDeadline: Date;
  status: JobStatus;
  description: string;
  
  // Additional fields for full functionality
  tenantId?: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  costEstimate?: number;
  actualCost?: number;
  images?: string[];
  tenantRating?: number; // 1-5
  tenantFeedback?: string;
  completedAt?: Date;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

// Technician - EXACTLY matching mock data structure
export interface Technician extends BaseEntity {
  name: string;
  avatar: string;
  skills: string[];
  currentWorkload: number;
  maxWorkload: number;
  availability: AvailabilityStatus;
  onTimePercentage: number;
  slaCompliance: number;
  phone: string;
  email: string;
  
  // Additional fields for full functionality
  userId?: string;
  technicianCode?: string; // e.g., "TCH-1023"
  rating?: number;
  totalJobsCompleted?: number;
  averageResponseTime?: number; // in minutes
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: Date;
  };
  isVerified?: boolean;
  hourlyRate?: number;
  assignedBuildings?: string[];
}

// Building - EXACTLY matching mock data structure
export interface Building extends BaseEntity {
  name: string;
  address: string;
  openTickets: number;
  totalUnits: number;
  slaRisk: SLARisk;
  assignedTechnicians: string[]; // technician IDs
  
  // Additional fields
  coordinates?: {
    lat: number;
    lng: number;
  };
  manager?: string;
  contactNumber?: string;
}

// ChatMessage - EXACTLY matching mock data structure
export interface ChatMessage extends BaseEntity {
  sender: string;
  senderRole: SenderRole;
  message: string;
  timestamp: Date;
  ticketId?: string;
  
  // Additional fields
  conversationId?: string;
  receiverId?: string;
  status?: MessageStatus;
  type?: MessageType;
}

// User - EXACTLY matching mock data structure
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  
  // Additional fields for auth and profile
  password?: string; // hashed
  phoneNumber?: string;
  avatarUrl?: string;
  lastLoginAt?: Date;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  buildingId?: string;
  unitNumber?: string;
}

// AuditLog - EXACTLY matching mock data structure
export interface AuditLog extends BaseEntity {
  action: string;
  user: string;
  details: string;
  timestamp: Date;
  ticketId?: string;
  
  // Additional fields
  ipAddress?: string;
  userAgent?: string;
}

// Dashboard statistics - EXACTLY matching mock data structure
export interface DashboardStats {
  totalActiveJobs: number;
  jobsDueToday: number;
  slaBreaches: number;
  availableTechnicians: number;
  totalTicketsAllTime: number;
  avgResponseTime: string; // e.g., "2.5 hrs"
  avgResolutionTime: string; // e.g., "4.2 hrs"
  overallSlaCompliance: number; // percentage
}

// Chart data types - EXACTLY matching mock data structure
export interface JobsPerDayData {
  date: string;
  jobs: number;
}

export interface JobsByCategoryData {
  category: string;
  count: number;
  fill: string; // color hex code
}

export interface SLAComplianceData {
  month: string;
  compliance: number; // percentage
}

// Notification types
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  body: string;
  type: 'job_assigned' | 'job_updated' | 'message_received' | 'sla_warning' | 'system';
  data?: Record<string, unknown>;
  isRead: boolean;
  ticketId?: string;
}

// Time tracking
export interface TimeTracking extends BaseEntity {
  jobId: string;
  technicianId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
}

// Material/Parts used in jobs
export interface Material extends BaseEntity {
  jobId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  supplier?: string;
}

// Job assignment history
export interface JobAssignment extends BaseEntity {
  jobId: string;
  technicianId: string;
  assignedBy: string;
  assignedAt: Date;
  unassignedAt?: Date;
  reason?: string;
}

// SLA configuration
export interface SLAConfig {
  priority: Priority;
  responseTime: number; // in minutes
  resolutionTime: number; // in minutes
}

// Technician schedule
export interface TechnicianSchedule extends BaseEntity {
  technicianId: string;
  date: Date;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
  notes?: string;
}
