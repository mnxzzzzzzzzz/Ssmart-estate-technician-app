import {
  TechnicianProfile,
  AccountSettings,
  TechnicianSkill,
  BuildingCode,
  AvailabilityStatus,
} from '../types/technician.types';

export const sampleTechnicianProfile: TechnicianProfile = {
  id: '1',
  technicianId: 'TCH-1023',
  fullName: 'John Doe',
  email: 'john.doe@maintenance.com',
  phoneNumber: '+1 (555) 123-4567',
  avatarUrl: undefined,
  skills: [
    TechnicianSkill.PLUMBING,
    TechnicianSkill.ELECTRICAL,
    TechnicianSkill.HVAC,
    TechnicianSkill.MAINTENANCE,
  ],
  assignedBuildings: [
    BuildingCode.BUILDING_A,
    BuildingCode.BUILDING_B,
    BuildingCode.BUILDING_C,
  ],
  availability: AvailabilityStatus.AVAILABLE,
  currentLocation: {
    latitude: 40.7128,
    longitude: -74.006,
    lastUpdated: new Date(),
  },
  rating: 4.8,
  totalJobsCompleted: 247,
  averageResponseTime: 12, // minutes
  joinDate: new Date('2023-01-15'),
  isVerified: true,
};

export const sampleAccountSettings: AccountSettings = {
  enableFaceId: true,
  enableTwoFactorAuth: false,
  notificationPreferences: {
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  autoAcceptJobs: false,
  defaultWorkRadius: 5, // kilometers
  workingHours: {
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York',
  },
};
