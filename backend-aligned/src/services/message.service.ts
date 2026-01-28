// Message Service

import prisma from '../config/database';
import { ChatMessage } from '../types/database.types';
import { SendMessageRequest, MessageFilters, ConversationListResponse } from '../types/api.types';
import { AppError } from '../middleware/error.middleware';
import { parsePagination } from '../utils/pagination.utils';

export class MessageService {
  // Get messages with filters
  async getMessages(filters: MessageFilters) {
    const { page, limit, skip } = parsePagination(filters);

    const where: any = {};

    if (filters.conversationId) where.conversationId = filters.conversationId;
    if (filters.ticketId) where.ticketId = filters.ticketId;
    if (filters.unreadOnly) where.status = { not: 'read' };

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
      }),
      prisma.chatMessage.count({ where }),
    ]);

    return {
      messages: messages as ChatMessage[],
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  // Get message by ID
  async getMessageById(id: string): Promise<ChatMessage> {
    const message = await prisma.chatMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
    }

    return message as ChatMessage;
  }

  // Send message
  async sendMessage(data: SendMessageRequest, senderName: string): Promise<ChatMessage> {
    // Determine sender role based on user context
    const senderRole = 'technician'; // Should be from auth context

    const message = await prisma.chatMessage.create({
      data: {
        sender: senderName,
        senderRole,
        message: data.message,
        conversationId: data.conversationId,
        receiverId: data.receiverId,
        ticketId: data.ticketId,
        type: data.type || 'text',
        status: 'sent',
        timestamp: new Date(),
      },
    });

    return message as ChatMessage;
  }

  // Mark message as read
  async markAsRead(id: string): Promise<ChatMessage> {
    const message = await this.getMessageById(id);

    const updatedMessage = await prisma.chatMessage.update({
      where: { id },
      data: { status: 'read' },
    });

    return updatedMessage as ChatMessage;
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string, userId: string): Promise<number> {
    const result = await prisma.chatMessage.updateMany({
      where: {
        conversationId,
        sender: { not: userId },
        status: { not: 'read' },
      },
      data: { status: 'read' },
    });

    return result.count;
  }

  // Get conversations list
  async getConversations(userId: string): Promise<ConversationListResponse> {
    // Get all conversations where user is a participant
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [{ sender: userId }, { receiverId: userId }],
      },
      orderBy: { timestamp: 'desc' },
    });

    // Group by conversation ID
    const conversationMap = new Map<string, any>();

    for (const message of messages) {
      const convId = message.conversationId || 'default';

      if (!conversationMap.has(convId)) {
        // Get unread count
        const unreadCount = await prisma.chatMessage.count({
          where: {
            conversationId: convId,
            receiverId: userId,
            status: { not: 'read' },
          },
        });

        conversationMap.set(convId, {
          id: convId,
          participants: [], // Would need to fetch from user table
          lastMessage: message,
          unreadCount,
          ticketId: message.ticketId,
        });
      }
    }

    return {
      conversations: Array.from(conversationMap.values()),
    };
  }

  // Get messages by ticket ID
  async getMessagesByTicketId(ticketId: string) {
    const messages = await prisma.chatMessage.findMany({
      where: { ticketId },
      orderBy: { timestamp: 'asc' },
    });

    return messages as ChatMessage[];
  }

  // Delete message
  async deleteMessage(id: string): Promise<void> {
    await this.getMessageById(id); // Check if exists

    await prisma.chatMessage.delete({
      where: { id },
    });
  }
}

export default new MessageService();
