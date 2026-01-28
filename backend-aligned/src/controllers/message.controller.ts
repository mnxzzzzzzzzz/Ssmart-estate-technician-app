// Message Controller

import { Request, Response, NextFunction } from 'express';
import messageService from '../services/message.service';
import { SendMessageRequest, MessageFilters, ApiResponse } from '../types/api.types';
import { asyncHandler } from '../middleware/error.middleware';

export class MessageController {
  // Get messages
  getMessages = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const filters: MessageFilters = req.query;
      const result = await messageService.getMessages(filters);

      res.status(200).json({
        success: true,
        data: result.messages,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          hasMore: result.hasMore,
        },
      });
    }
  );

  // Get message by ID
  getMessageById = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const result = await messageService.getMessageById(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Send message
  sendMessage = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const data: SendMessageRequest = req.body;
      const senderName = req.user?.email || 'Unknown'; // Should get from user context
      const result = await messageService.sendMessage(data, senderName);

      res.status(201).json({
        success: true,
        data: result,
      });
    }
  );

  // Mark message as read
  markAsRead = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      const result = await messageService.markAsRead(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Mark conversation as read
  markConversationAsRead = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { conversationId } = req.params;
      const userId = req.user?.userId || '';
      const count = await messageService.markConversationAsRead(conversationId, userId);

      res.status(200).json({
        success: true,
        data: { markedCount: count },
      });
    }
  );

  // Get conversations
  getConversations = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const userId = req.user?.userId || '';
      const result = await messageService.getConversations(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Get messages by ticket ID
  getMessagesByTicketId = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { ticketId } = req.params;
      const result = await messageService.getMessagesByTicketId(ticketId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  // Delete message
  deleteMessage = asyncHandler(
    async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
      const { id } = req.params;
      await messageService.deleteMessage(id);

      res.status(200).json({
        success: true,
        data: { message: 'Message deleted successfully' },
      });
    }
  );
}

export default new MessageController();
