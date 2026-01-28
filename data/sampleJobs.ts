import { Job } from '../types';

// Sample job data for testing
export const sampleJobs: Job[] = [
  {
    id: 1,
    title: 'Toilet Flush Fix',
    category: 'Plumbing',
    priority: 'Urgent',
    status: 'Assigned',
    location: {
      building: 'Building A',
      apartment: 'Apt 301',
    },
    timeSlot: '11:00 AM – 12:00 PM',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
    description: 'Toilet flush mechanism not working properly',
    tenant: {
      name: 'John Smith',
      phone: '+1 234-567-8900',
      email: 'john.smith@email.com',
    },
  },
  {
    id: 2,
    title: 'AC Not Cooling',
    category: 'HVAC',
    priority: 'High',
    status: 'In Progress',
    location: {
      building: 'Building B',
      apartment: 'Apt 205',
    },
    timeSlot: '02:00 PM – 03:00 PM',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    description: 'Air conditioning unit not cooling effectively',
    tenant: {
      name: 'Sarah Johnson',
      phone: '+1 234-567-8901',
      email: 'sarah.j@email.com',
    },
  },
  {
    id: 3,
    title: 'Light Switch Replacement',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Assigned',
    location: {
      building: 'Building C',
      apartment: 'Apt 102',
    },
    timeSlot: '04:00 PM – 05:00 PM',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    description: 'Living room light switch needs replacement',
    tenant: {
      name: 'Mike Davis',
      phone: '+1 234-567-8902',
      email: 'mike.davis@email.com',
    },
  },
  {
    id: 4,
    title: 'Cabinet Door Repair',
    category: 'Carpentry',
    priority: 'Low',
    status: 'Assigned',
    location: {
      building: 'Building A',
      apartment: 'Apt 405',
    },
    timeSlot: '09:00 AM – 10:00 AM',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Kitchen cabinet door hinge broken',
    tenant: {
      name: 'Emily Wilson',
      phone: '+1 234-567-8903',
      email: 'emily.w@email.com',
    },
  },
  {
    id: 5,
    title: 'Leaking Faucet',
    category: 'Plumbing',
    priority: 'High',
    status: 'Assigned',
    location: {
      building: 'Building D',
      apartment: 'Apt 501',
    },
    timeSlot: '01:00 PM – 02:00 PM',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    description: 'Bathroom sink faucet dripping continuously',
    tenant: {
      name: 'Robert Brown',
      phone: '+1 234-567-8904',
      email: 'robert.b@email.com',
    },
  },
  {
    id: 6,
    title: 'General Maintenance Check',
    category: 'Maintenance',
    priority: 'Low',
    status: 'Completed',
    location: {
      building: 'Building B',
      apartment: 'Apt 308',
    },
    timeSlot: '10:00 AM – 11:00 AM',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: 'Monthly maintenance inspection',
    tenant: {
      name: 'Lisa Anderson',
      phone: '+1 234-567-8905',
      email: 'lisa.a@email.com',
    },
  },
];
