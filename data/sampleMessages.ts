import {
  Conversation,
  Message,
  MessageType,
  MessageStatus,
  UserRole,
} from '../types/message.types';

// Sample messages for testing
export const sampleMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      senderName: 'John Smith',
      senderRole: UserRole.TENANT,
      content: 'Hi, I have an issue with the toilet flush in my apartment.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: MessageStatus.READ,
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'Hello John! I received your request. Can you describe the issue in more detail?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
      status: MessageStatus.READ,
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      senderName: 'John Smith',
      senderRole: UserRole.TENANT,
      content: 'The handle needs to be pressed multiple times to flush. Sometimes water keeps running.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 1.4 * 60 * 60 * 1000),
      status: MessageStatus.READ,
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      senderName: 'John Smith',
      senderRole: UserRole.TENANT,
      content: 'Here is a photo of the issue',
      type: MessageType.IMAGE,
      timestamp: new Date(Date.now() - 1.3 * 60 * 60 * 1000),
      status: MessageStatus.READ,
      metadata: {
        fileUrl: 'https://via.placeholder.com/400/FF9500/FFFFFF?text=Toilet+Issue',
        thumbnailUrl: 'https://via.placeholder.com/150/FF9500/FFFFFF?text=Toilet',
        width: 400,
        height: 300,
      },
    },
    {
      id: 'msg-5',
      conversationId: 'conv-1',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'Thank you for the photo. I can see the issue. I will be there at 11:00 AM today to fix it.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: MessageStatus.READ,
    },
    {
      id: 'msg-6',
      conversationId: 'conv-1',
      senderId: 'tenant-1',
      senderName: 'John Smith',
      senderRole: UserRole.TENANT,
      content: 'Perfect! Thank you so much. I will be home.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
      status: MessageStatus.READ,
    },
    {
      id: 'msg-7',
      conversationId: 'conv-1',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'I am on my way now. Should arrive in 10 minutes.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: MessageStatus.DELIVERED,
    },
  ],
  'conv-2': [
    {
      id: 'msg-8',
      conversationId: 'conv-2',
      senderId: 'tenant-2',
      senderName: 'Sarah Johnson',
      senderRole: UserRole.TENANT,
      content: 'The AC is not cooling properly. Can you check it today?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: MessageStatus.DELIVERED,
    },
    {
      id: 'msg-9',
      conversationId: 'conv-2',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'Yes, I can come by this afternoon. What time works best for you?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      status: MessageStatus.SENT,
    },
  ],
  'conv-3': [
    {
      id: 'msg-10',
      conversationId: 'conv-3',
      senderId: 'tenant-3',
      senderName: 'Mike Davis',
      senderRole: UserRole.TENANT,
      content: 'Light switch is sparking. This is urgent!',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      status: MessageStatus.DELIVERED,
    },
  ],
};

// Sample conversations for testing
export const sampleConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      {
        id: 'tenant-1',
        name: 'Tenant 1',
        role: UserRole.TENANT,
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        isOnline: true,
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-7',
      conversationId: 'conv-1',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'I am on my way now. Should arrive in 10 minutes.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: MessageStatus.DELIVERED,
    },
    unreadCount: 0,
    jobId: '1',
    jobTitle: 'Toilet Flush Fix',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    isTyping: false,
  },
  {
    id: 'conv-2',
    participants: [
      {
        id: 'tenant-2',
        name: 'Tenant 2',
        role: UserRole.TENANT,
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        isOnline: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-9',
      conversationId: 'conv-2',
      senderId: 'tech-1',
      senderName: 'You',
      senderRole: UserRole.TECHNICIAN,
      content: 'Yes, I can come by this afternoon. What time works best for you?',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: MessageStatus.SENT,
    },
    unreadCount: 1,
    jobId: '2',
    jobTitle: 'AC Not Cooling',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000),
    isTyping: false,
  },
  {
    id: 'conv-3',
    participants: [
      {
        id: 'ops-manager-1',
        name: 'Operations Manager',
        role: UserRole.OPERATIONS_MANAGER,
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        isOnline: true,
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-10',
      conversationId: 'conv-3',
      senderId: 'ops-manager-1',
      senderName: 'Operations Manager',
      senderRole: UserRole.OPERATIONS_MANAGER,
      content: 'Please prioritize the electrical issues in Building A.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      status: MessageStatus.DELIVERED,
    },
    unreadCount: 1,
    jobId: '3',
    jobTitle: 'Building A Electrical Priority',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
    isTyping: false,
  },
  {
    id: 'conv-4',
    participants: [
      {
        id: 'tenant-4',
        name: 'Tenant 2',
        role: UserRole.TENANT,
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-11',
      conversationId: 'conv-4',
      senderId: 'tenant-4',
      senderName: 'Tenant 2',
      senderRole: UserRole.TENANT,
      content: 'Thank you for fixing the cabinet door!',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: MessageStatus.READ,
    },
    unreadCount: 0,
    jobId: '4',
    jobTitle: 'Cabinet Door Repair',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isTyping: false,
  },
  {
    id: 'conv-5',
    participants: [
      {
        id: 'tenant-5',
        name: 'Tenant 3',
        role: UserRole.TENANT,
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        isOnline: true,
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-12',
      conversationId: 'conv-5',
      senderId: 'tenant-5',
      senderName: 'Tenant 3',
      senderRole: UserRole.TENANT,
      content: 'The heating is not working in my unit.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: MessageStatus.DELIVERED,
    },
    unreadCount: 1,
    jobId: '5',
    jobTitle: 'Heating Issue',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000),
    isTyping: false,
  },
  {
    id: 'conv-6',
    participants: [
      {
        id: 'tenant-6',
        name: 'Tenant 4',
        role: UserRole.TENANT,
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        isOnline: false,
        lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: 'tech-1',
        name: 'You',
        role: UserRole.TECHNICIAN,
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'msg-13',
      conversationId: 'conv-6',
      senderId: 'tenant-6',
      senderName: 'Tenant 4',
      senderRole: UserRole.TENANT,
      content: 'Water pressure is very low in the shower.',
      type: MessageType.TEXT,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: MessageStatus.READ,
    },
    unreadCount: 0,
    jobId: '6',
    jobTitle: 'Low Water Pressure',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isTyping: false,
  },
];

// Helper function to get messages by conversation ID
export const getMessagesByConversationId = (conversationId: string): Message[] => {
  return sampleMessages[conversationId] || [];
};

// Helper function to get conversation by ID
export const getConversationById = (conversationId: string): Conversation | undefined => {
  return sampleConversations.find((conv) => conv.id === conversationId);
};
