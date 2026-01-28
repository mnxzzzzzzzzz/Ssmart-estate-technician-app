// Technician Profile Types with strict TypeScript

export enum TechnicianSkill {
  HVAC = 'HVAC',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  CARPENTRY = 'Carpentry',
  MAINTENANCE = 'Maintenance',
  PAINTING = 'Painting',
  LANDSCAPING = 'Landscaping',
  SECURITY = 'Security',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFDUTY = 'offduty',
  ONBREAK = 'onbreak',
}

export enum BuildingCode {
  BUILDING_A = 'Building A',
  BUILDING_B = 'Building B',
  BUILDING_C = 'Building C',
  BUILDING_D = 'Building D',
  BUILDING_E = 'Building E',
  BUILDING_F = 'Building F',
}

export interface Location {
  latitude: number;
  longitude: number;
  lastUpdated: Date;
}

export interface WorkingHours {
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  timezone: string;
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface AccountSettings {
  enableFaceId: boolean;
  enableTwoFactorAuth: boolean;
  notificationPreferences: NotificationPreferences;
  autoAcceptJobs: boolean;
  defaultWorkRadius: number; // in kilometers
  workingHours: WorkingHours;
}

export interface TechnicianProfile {
  id: string;
  technicianId: string; // e.g., "TCH-1023"
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  skills: TechnicianSkill[];
  assignedBuildings: BuildingCode[];
  availability: AvailabilityStatus;
  currentLocation?: Location;
  rating: number;
  totalJobsCompleted: number;
  averageResponseTime: number; // in minutes
  joinDate: Date;
  isVerified: boolean;
}

// Component Props Interfaces
export interface SkillTagProps {
  skill: TechnicianSkill;
  isSelected?: boolean;
  onPress?: (skill: TechnicianSkill) => void;
  removable?: boolean;
  showIcon?: boolean;
}

export interface AvailabilityToggleProps {
  status: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
  disabled?: boolean;
}

export interface BuildingItemProps {
  building: BuildingCode;
  isAssigned: boolean;
  onToggle: (building: BuildingCode, assigned: boolean) => void;
}

// API Response Types
export interface ProfileUpdateRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  skills?: TechnicianSkill[];
  assignedBuildings?: BuildingCode[];
  availability?: AvailabilityStatus;
  avatarUrl?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  profile: TechnicianProfile;
  message?: string;
}

export interface SettingsUpdateRequest {
  settings: Partial<AccountSettings>;
}

export interface SettingsUpdateResponse {
  success: boolean;
  settings: AccountSettings;
  message?: string;
}

// Utility Types
export type AvailabilityConfig = {
  [key in AvailabilityStatus]: {
    label: string;
    color: string;
    icon: string;
    description: string;
  };
};

export type SkillConfig = {
  [key in TechnicianSkill]: {
    icon: string;
    color: string;
  };
};
