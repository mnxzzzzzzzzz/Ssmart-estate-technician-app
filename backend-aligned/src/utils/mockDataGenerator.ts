// Mock Data Generator - EXACTLY matching mockData.ts.txt structure

import {
  MaintenanceJob,
  Technician,
  Building,
  ChatMessage,
  User,
  AuditLog,
  DashboardStats,
  JobsPerDayData,
  JobsByCategoryData,
  SLAComplianceData,
  Priority,
  JobStatus,
  AvailabilityStatus,
  SLARisk,
} from '../types/database.types';

// Generate mock maintenance jobs matching exact structure
export const generateMockJobs = (count: number = 20): MaintenanceJob[] => {
  const categories = ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural'];
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  const statuses: JobStatus[] = ['pending', 'assigned', 'in-progress', 'completed', 'escalated'];
  const buildings = ['Tower A', 'Tower B', 'Tower C', 'Building D'];
  const technicians = ['Mike Johnson', 'Sarah Williams', 'David Chen', null];
  
  return Array.from({ length: count }, (_, i) => {
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const assignedTech = technicians[Math.floor(Math.random() * technicians.length)];
    
    return {
      id: `job-${i + 1}`,
      ticketId: `TKT-2024-${String(i + 1).padStart(3, '0')}`,
      issueCategory: categories[Math.floor(Math.random() * categories.length)],
      aiConfidence: 0.85 + Math.random() * 0.14, // 0.85-0.99
      priority,
      building: buildings[Math.floor(Math.random() * buildings.length)],
      unit: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
      tenant: `Tenant ${i + 1}`,
      assignedTechnician: assignedTech,
      technicianId: assignedTech ? `tech-${Math.floor(Math.random() * 3) + 1}` : null,
      slaDeadline: new Date(Date.now() + (Math.random() * 48 * 60 * 60 * 1000)),
      status,
      description: `Issue description for ticket ${i + 1}`,
      estimatedDuration: Math.floor(Math.random() * 180) + 30,
      images: [],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });
};

// Generate mock technicians matching exact structure
export const generateMockTechnicians = (): Technician[] => {
  const availabilities: AvailabilityStatus[] = ['available', 'busy', 'offline'];
  
  return [
    {
      id: 'tech-1',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      skills: ['Plumbing', 'HVAC'],
      currentWorkload: 3,
      maxWorkload: 6,
      availability: 'available',
      onTimePercentage: 94.5,
      slaCompliance: 96.2,
      phone: '+1 (555) 123-4567',
      email: 'mike.johnson@smartestate.com',
      technicianCode: 'TCH-1001',
      rating: 4.8,
      totalJobsCompleted: 247,
      averageResponseTime: 15,
      isVerified: true,
      hourlyRate: 75,
      assignedBuildings: ['Tower A', 'Tower B'],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
    },
    {
      id: 'tech-2',
      name: 'Sarah Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      skills: ['Electrical', 'Appliance'],
      currentWorkload: 5,
      maxWorkload: 6,
      availability: 'busy',
      onTimePercentage: 92.1,
      slaCompliance: 94.8,
      phone: '+1 (555) 234-5678',
      email: 'sarah.williams@smartestate.com',
      technicianCode: 'TCH-1002',
      rating: 4.7,
      totalJobsCompleted: 189,
      averageResponseTime: 18,
      isVerified: true,
      hourlyRate: 70,
      assignedBuildings: ['Tower C', 'Building D'],
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date(),
    },
    {
      id: 'tech-3',
      name: 'David Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      skills: ['Structural', 'HVAC', 'Plumbing'],
      currentWorkload: 2,
      maxWorkload: 6,
      availability: 'available',
      onTimePercentage: 96.8,
      slaCompliance: 98.1,
      phone: '+1 (555) 345-6789',
      email: 'david.chen@smartestate.com',
      technicianCode: 'TCH-1003',
      rating: 4.9,
      totalJobsCompleted: 312,
      averageResponseTime: 12,
      isVerified: true,
      hourlyRate: 80,
      assignedBuildings: ['Tower A', 'Tower C'],
      createdAt: new Date('2022-11-10'),
      updatedAt: new Date(),
    },
  ];
};

// Generate mock buildings matching exact structure
export const generateMockBuildings = (): Building[] => {
  const slaRisks: SLARisk[] = ['low', 'medium', 'high'];
  
  return [
    {
      id: 'building-1',
      name: 'Tower A',
      address: '123 Main Street, Downtown',
      openTickets: 8,
      totalUnits: 120,
      slaRisk: 'medium',
      assignedTechnicians: ['tech-1', 'tech-3'],
      coordinates: { lat: 40.7128, lng: -74.0060 },
      manager: 'John Manager',
      contactNumber: '+1 (555) 111-2222',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date(),
    },
    {
      id: 'building-2',
      name: 'Tower B',
      address: '456 Oak Avenue, Midtown',
      openTickets: 5,
      totalUnits: 100,
      slaRisk: 'low',
      assignedTechnicians: ['tech-1'],
      coordinates: { lat: 40.7589, lng: -73.9851 },
      manager: 'Jane Manager',
      contactNumber: '+1 (555) 222-3333',
      createdAt: new Date('2020-06-15'),
      updatedAt: new Date(),
    },
    {
      id: 'building-3',
      name: 'Tower C',
      address: '789 Pine Street, Uptown',
      openTickets: 12,
      totalUnits: 150,
      slaRisk: 'high',
      assignedTechnicians: ['tech-2', 'tech-3'],
      coordinates: { lat: 40.7829, lng: -73.9654 },
      manager: 'Bob Manager',
      contactNumber: '+1 (555) 333-4444',
      createdAt: new Date('2019-09-20'),
      updatedAt: new Date(),
    },
  ];
};

// Generate mock chat messages matching exact structure
export const generateMockMessages = (ticketId?: string): ChatMessage[] => {
  return [
    {
      id: 'msg-1',
      sender: 'Operations Team',
      senderRole: 'operations',
      message: 'New ticket assigned. Please review and provide ETA.',
      timestamp: new Date(Date.now() - 3600000),
      ticketId: ticketId || 'TKT-2024-001',
      status: 'read',
      type: 'text',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'msg-2',
      sender: 'Mike Johnson',
      senderRole: 'technician',
      message: 'Acknowledged. Will arrive in 30 minutes.',
      timestamp: new Date(Date.now() - 3000000),
      ticketId: ticketId || 'TKT-2024-001',
      status: 'read',
      type: 'text',
      createdAt: new Date(Date.now() - 3000000),
      updatedAt: new Date(Date.now() - 3000000),
    },
    {
      id: 'msg-3',
      sender: 'John Smith',
      senderRole: 'tenant',
      message: 'Thank you! The issue is getting worse.',
      timestamp: new Date(Date.now() - 2400000),
      ticketId: ticketId || 'TKT-2024-001',
      status: 'delivered',
      type: 'text',
      createdAt: new Date(Date.now() - 2400000),
      updatedAt: new Date(Date.now() - 2400000),
    },
  ];
};

// Generate mock users matching exact structure
export const generateMockUsers = (): User[] => {
  return [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'tenant',
      status: 'active',
      phoneNumber: '+1 (555) 111-1111',
      buildingId: 'building-1',
      unitNumber: '12B',
      emailVerified: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
    },
    {
      id: 'user-2',
      name: 'Mike Johnson',
      email: 'mike.johnson@smartestate.com',
      role: 'technician',
      status: 'active',
      phoneNumber: '+1 (555) 123-4567',
      emailVerified: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
    },
    {
      id: 'user-3',
      name: 'Operations Team',
      email: 'operations@smartestate.com',
      role: 'operations',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date(),
    },
  ];
};

// Generate mock audit logs matching exact structure
export const generateMockAuditLogs = (): AuditLog[] => {
  return [
    {
      id: 'audit-1',
      action: 'Job Assigned',
      user: 'Operations Team',
      details: 'Assigned TKT-2024-001 to Mike Johnson',
      timestamp: new Date(Date.now() - 7200000),
      ticketId: 'TKT-2024-001',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
    },
    {
      id: 'audit-2',
      action: 'Status Updated',
      user: 'Mike Johnson',
      details: 'Changed status from pending to in-progress',
      timestamp: new Date(Date.now() - 3600000),
      ticketId: 'TKT-2024-001',
      ipAddress: '192.168.1.101',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
    },
  ];
};

// Generate dashboard stats matching exact structure
export const generateDashboardStats = (): DashboardStats => {
  return {
    totalActiveJobs: 25,
    jobsDueToday: 8,
    slaBreaches: 2,
    availableTechnicians: 12,
    totalTicketsAllTime: 1247,
    avgResponseTime: '2.5 hrs',
    avgResolutionTime: '4.2 hrs',
    overallSlaCompliance: 94.8,
  };
};

// Generate jobs per day data matching exact structure
export const generateJobsPerDayData = (): JobsPerDayData[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((date, i) => ({
    date,
    jobs: Math.floor(Math.random() * 20) + 10,
  }));
};

// Generate jobs by category data matching exact structure
export const generateJobsByCategoryData = (): JobsByCategoryData[] => {
  return [
    { category: 'Plumbing', count: 45, fill: '#3b82f6' },
    { category: 'Electrical', count: 32, fill: '#f59e0b' },
    { category: 'HVAC', count: 28, fill: '#10b981' },
    { category: 'Appliance', count: 18, fill: '#8b5cf6' },
    { category: 'Structural', count: 12, fill: '#ef4444' },
  ];
};

// Generate SLA compliance data matching exact structure
export const generateSLAComplianceData = (): SLAComplianceData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    compliance: 90 + Math.random() * 8, // 90-98%
  }));
};
