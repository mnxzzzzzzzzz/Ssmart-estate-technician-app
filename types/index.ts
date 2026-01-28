// Core type definitions for the Technician Maintenance App

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'technician' | 'admin' | 'tenant';
}

export interface Tenant {
  name: string;
  phone: string;
  email: string;
}

export interface Location {
  building: string;
  apartment: string;
  address?: string;
}

export type JobCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Carpentry' | 'Maintenance';

export type JobPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type JobStatus = 
  | 'Assigned' 
  | 'Accepted' 
  | 'En Route' 
  | 'On Site' 
  | 'Working' 
  | 'Completed';

export interface Job {
  id: number;
  title: string;
  category: JobCategory;
  priority: JobPriority;
  status: JobStatus;
  location: Location;
  timeSlot: string;
  createdAt: string;
  description: string;
  tenant: Tenant;
}

export interface Material {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Media {
  id: number;
  uri: string;
  type: 'image' | 'video';
  category: 'before' | 'after';
  timestamp: string;
}

export interface TimeTracking {
  isRunning: boolean;
  startTime: string | null;
  elapsedTime: number;
}

export interface JobDetails extends Job {
  notes?: string;
  materials: Material[];
  media: Media[];
  timeTracking: TimeTracking;
}

export interface ProgressStep {
  id: number;
  label: string;
  status: JobStatus;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface JobsResponse {
  jobs: Job[];
}

export interface JobDetailsResponse {
  job: JobDetails;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  TechnicianDashboard: undefined;
  JobDetails: { jobId: number };
  AddMaterial: { jobId: number; onMaterialAdded: (material: Material) => void };
  FilterModal: { filterType: string };
  Notifications: undefined;
  Profile: undefined;
  ForgotPassword: undefined;
  Chat: { conversationId: string; participantName: string; jobTitle?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Messages: undefined;
  Profile: undefined;
};
