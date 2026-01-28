// Database Configuration using Prisma

import { PrismaClient } from '@prisma/client';

// Create Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test database connection
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Disconnect database
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  console.log('Database disconnected');
};

// Handle shutdown
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

export default prisma;
