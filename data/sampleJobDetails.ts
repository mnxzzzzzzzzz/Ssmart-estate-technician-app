import { JobDetails } from '../types';

// Sample detailed job data for testing JobDetailsScreen
export const sampleJobDetails: Record<number, JobDetails> = {
  1: {
    id: 1,
    title: 'Toilet Flush Fix',
    category: 'Plumbing',
    priority: 'Urgent',
    status: 'Assigned',
    location: {
      building: 'Building A',
      apartment: 'Apt 301',
      address: '123 Main Street, Floor 3, Unit 301',
    },
    timeSlot: '11:00 AM – 12:00 PM',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    description:
      'The toilet flush mechanism is not working properly. When I press the handle, it takes multiple attempts to flush. Sometimes water keeps running after flushing. This has been happening for the past 2 days and is getting worse.',
    tenant: {
      name: 'John Smith',
      phone: '+1 234-567-8900',
      email: 'john.smith@email.com',
    },
    notes: '',
    materials: [],
    media: [],
    timeTracking: {
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    },
  },
  2: {
    id: 2,
    title: 'AC Not Cooling',
    category: 'HVAC',
    priority: 'High',
    status: 'Working',
    location: {
      building: 'Building B',
      apartment: 'Apt 205',
      address: '456 Oak Avenue, Floor 2, Unit 205',
    },
    timeSlot: '02:00 PM – 03:00 PM',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    description:
      'Air conditioning unit is running but not cooling the apartment effectively. The temperature stays around 78°F even when set to 68°F. The unit seems to be blowing air but it is not cold.',
    tenant: {
      name: 'Sarah Johnson',
      phone: '+1 234-567-8901',
      email: 'sarah.j@email.com',
    },
    notes: 'Checked the air filter - needs replacement. Refrigerant levels appear low. Will need to add refrigerant and replace filter.',
    materials: [
      {
        id: 1,
        name: 'Air Filter 16x20',
        quantity: 1,
        unitPrice: 15.99,
      },
      {
        id: 2,
        name: 'R-410A Refrigerant',
        quantity: 2,
        unitPrice: 45.0,
      },
    ],
    media: [
      {
        id: 1,
        uri: 'https://via.placeholder.com/400/FF9500/FFFFFF?text=Before',
        type: 'image',
        category: 'before',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        uri: 'https://via.placeholder.com/400/34C759/FFFFFF?text=After',
        type: 'image',
        category: 'after',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
    timeTracking: {
      isRunning: true,
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      elapsedTime: 1200, // 20 minutes from previous session
    },
  },
  3: {
    id: 3,
    title: 'Light Switch Replacement',
    category: 'Electrical',
    priority: 'Medium',
    status: 'Accepted',
    location: {
      building: 'Building C',
      apartment: 'Apt 102',
      address: '789 Pine Street, Floor 1, Unit 102',
    },
    timeSlot: '04:00 PM – 05:00 PM',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description:
      'Living room light switch is loose and sparking occasionally when turned on/off. This is a safety concern and needs immediate attention.',
    tenant: {
      name: 'Mike Davis',
      phone: '+1 234-567-8902',
      email: 'mike.davis@email.com',
    },
    notes: '',
    materials: [],
    media: [],
    timeTracking: {
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    },
  },
  4: {
    id: 4,
    title: 'Cabinet Door Repair',
    category: 'Carpentry',
    priority: 'Low',
    status: 'Completed',
    location: {
      building: 'Building A',
      apartment: 'Apt 405',
      address: '123 Main Street, Floor 4, Unit 405',
    },
    timeSlot: '09:00 AM – 10:00 AM',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description:
      'Kitchen cabinet door hinge is broken. The door is hanging at an angle and difficult to close properly.',
    tenant: {
      name: 'Emily Wilson',
      phone: '+1 234-567-8903',
      email: 'emily.w@email.com',
    },
    notes: 'Replaced broken hinge with new heavy-duty hinge. Adjusted alignment and tested door operation. Cabinet door now closes smoothly.',
    materials: [
      {
        id: 1,
        name: 'Cabinet Hinge (Heavy Duty)',
        quantity: 2,
        unitPrice: 8.5,
      },
      {
        id: 2,
        name: 'Wood Screws 1.5"',
        quantity: 8,
        unitPrice: 0.25,
      },
    ],
    media: [
      {
        id: 1,
        uri: 'https://via.placeholder.com/400/FF9500/FFFFFF?text=Before+1',
        type: 'image',
        category: 'before',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        uri: 'https://via.placeholder.com/400/FF9500/FFFFFF?text=Before+2',
        type: 'image',
        category: 'before',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        uri: 'https://via.placeholder.com/400/34C759/FFFFFF?text=After+1',
        type: 'image',
        category: 'after',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        uri: 'https://via.placeholder.com/400/34C759/FFFFFF?text=After+2',
        type: 'image',
        category: 'after',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ],
    timeTracking: {
      isRunning: false,
      startTime: null,
      elapsedTime: 2700, // 45 minutes total
    },
  },
};

// Helper function to get job details by ID
export const getJobDetailsById = (jobId: number): JobDetails | null => {
  return sampleJobDetails[jobId] || null;
};
