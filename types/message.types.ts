// Message and Chat Type Definitions

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  SYSTEM = 'system',
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export enum UserRole {
  TENANT = 'tenant',
  TECHNICIAN = 'technician',
  MANAGER = 'manager',
  OPERATIONS_MANAGER = 'operations_manager',
}

export interface MessageMetadata {
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // for audio/video in seconds
  width?: number; // for images/videos
  height?: number; // for images/videos
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
  metadata?: MessageMetadata;
  replyTo?: string; // ID of message being replied to
}

export interface Participant {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  jobId?: string;
  jobTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  isTyping?: boolean;
  typingUsers?: string[]; // Array of user IDs currently typing
}

// Component Props Interfaces
export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showTimestamp?: boolean;
  showSenderName?: boolean;
  onPress?: (message: Message) => void;
  onLongPress?: (message: Message) => void;
}

export interface ConversationItemProps {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
  onLongPress?: (conversation: Conversation) => void;
}

export interface ChatInputProps {
  onSendMessage: (content: string, type: MessageType) => void;
  onAttachFile?: () => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

// API Response Types
export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: MessageType;
  metadata?: MessageMetadata;
  replyTo?: string;
}

export interface SendMessageResponse {
  message: Message;
  success: boolean;
}

export interface MarkAsReadRequest {
  conversationId: string;
  messageIds: string[];
}

export interface TypingIndicatorRequest {
  conversationId: string;
  isTyping: boolean;
}

// Navigation Types
export interface MessagesScreenNavigationProp {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
}

export interface ChatScreenRouteProp {
  params: {
    conversationId: string;
    participantName: string;
    jobTitle?: string;
  };
}
