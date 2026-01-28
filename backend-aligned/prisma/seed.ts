// Prisma Seed File - Populate database with mock data

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.utils';
import {
  generateMockJobs,
  generateMockTechnicians,
  generateMockBuildings,
  generateMockUsers,
  generateMockMessages,
  generateMockAuditLogs,
} from '../src/utils/mockDataGenerator';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.timeTracking.deleteMany();
  await prisma.material.deleteMany();
  await prisma.jobAssignment.deleteMany();
  await prisma.technicianSchedule.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.maintenanceJob.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.building.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('Creating users...');
  const hashedPassword = await hashPassword('Password123!');

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@smartestate.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      emailVerified: true,
    },
  });

  const operationsUser = await prisma.user.create({
    data: {
      name: 'Operations Team',
      email: 'operations@smartestate.com',
      password: hashedPassword,
      role: 'operations',
      status: 'active',
      emailVerified: true,
    },
  });

  // Create technician users
  const techUser1 = await prisma.user.create({
    data: {
      name: 'Mike Johnson',
      email: 'mike.johnson@smartestate.com',
      password: hashedPassword,
      role: 'technician',
      status: 'active',
      phoneNumber: '+1 (555) 123-4567',
      emailVerified: true,
    },
  });

  const techUser2 = await prisma.user.create({
    data: {
      name: 'Sarah Williams',
      email: 'sarah.williams@smartestate.com',
      password: hashedPassword,
      role: 'technician',
      status: 'active',
      phoneNumber: '+1 (555) 234-5678',
      emailVerified: true,
    },
  });

  const techUser3 = await prisma.user.create({
    data: {
      name: 'David Chen',
      email: 'david.chen@smartestate.com',
      password: hashedPassword,
      role: 'technician',
      status: 'active',
      phoneNumber: '+1 (555) 345-6789',
      emailVerified: true,
    },
  });

  // Create tenant users
  const tenantUser = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: hashedPassword,
      role: 'tenant',
      status: 'active',
      phoneNumber: '+1 (555) 111-1111',
      buildingId: 'Tower A',
      unitNumber: '12B',
      emailVerified: true,
    },
  });

  console.log('✅ Users created');

  // Create technicians
  console.log('Creating technicians...');
  const tech1 = await prisma.technician.create({
    data: {
      userId: techUser1.id,
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
    },
  });

  const tech2 = await prisma.technician.create({
    data: {
      userId: techUser2.id,
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
    },
  });

  const tech3 = await prisma.technician.create({
    data: {
      userId: techUser3.id,
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
    },
  });

  console.log('✅ Technicians created');

  // Create buildings
  console.log('Creating buildings...');
  await prisma.building.createMany({
    data: [
      {
        name: 'Tower A',
        address: '123 Main Street, Downtown',
        openTickets: 8,
        totalUnits: 120,
        slaRisk: 'medium',
        assignedTechnicians: [tech1.id, tech3.id],
        latitude: 40.7128,
        longitude: -74.006,
        manager: 'John Manager',
        contactNumber: '+1 (555) 111-2222',
      },
      {
        name: 'Tower B',
        address: '456 Oak Avenue, Midtown',
        openTickets: 5,
        totalUnits: 100,
        slaRisk: 'low',
        assignedTechnicians: [tech1.id],
        latitude: 40.7589,
        longitude: -73.9851,
        manager: 'Jane Manager',
        contactNumber: '+1 (555) 222-3333',
      },
      {
        name: 'Tower C',
        address: '789 Pine Street, Uptown',
        openTickets: 12,
        totalUnits: 150,
        slaRisk: 'high',
        assignedTechnicians: [tech2.id, tech3.id],
        latitude: 40.7829,
        longitude: -73.9654,
        manager: 'Bob Manager',
        contactNumber: '+1 (555) 333-4444',
      },
    ],
  });

  console.log('✅ Buildings created');

  // Create maintenance jobs
  console.log('Creating maintenance jobs...');
  const mockJobs = generateMockJobs(20);

  for (const job of mockJobs) {
    await prisma.maintenanceJob.create({
      data: {
        ticketId: job.ticketId,
        issueCategory: job.issueCategory,
        aiConfidence: job.aiConfidence,
        priority: job.priority,
        building: job.building,
        unit: job.unit,
        tenant: job.tenant,
        tenantId: tenantUser.id,
        assignedTechnician: job.assignedTechnician,
        technicianId: job.technicianId,
        slaDeadline: job.slaDeadline,
        status: job.status,
        description: job.description,
        estimatedDuration: job.estimatedDuration,
        images: job.images,
      },
    });
  }

  console.log('✅ Maintenance jobs created');

  // Create chat messages
  console.log('Creating chat messages...');
  const mockMessages = generateMockMessages('TKT-2024-001');

  for (const message of mockMessages) {
    await prisma.chatMessage.create({
      data: {
        sender: message.sender,
        senderRole: message.senderRole,
        message: message.message,
        timestamp: message.timestamp,
        ticketId: message.ticketId,
        status: message.status,
        type: message.type,
      },
    });
  }

  console.log('✅ Chat messages created');

  // Create audit logs
  console.log('Creating audit logs...');
  const mockAuditLogs = generateMockAuditLogs();

  for (const log of mockAuditLogs) {
    await prisma.auditLog.create({
      data: {
        action: log.action,
        user: log.user,
        details: log.details,
        timestamp: log.timestamp,
        ticketId: log.ticketId,
        ipAddress: log.ipAddress,
      },
    });
  }

  console.log('✅ Audit logs created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@smartestate.com / Password123!');
  console.log('Operations: operations@smartestate.com / Password123!');
  console.log('Technician 1: mike.johnson@smartestate.com / Password123!');
  console.log('Technician 2: sarah.williams@smartestate.com / Password123!');
  console.log('Technician 3: david.chen@smartestate.com / Password123!');
  console.log('Tenant: john.smith@example.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
