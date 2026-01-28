// Message Routes

import { Router } from 'express';
import { body, param } from 'express-validator';
import messageController from '../controllers/message.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send message validation
const sendMessageValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Valid message type is required'),
];

// Routes
router.get('/', messageController.getMessages);
router.get('/conversations', messageController.getConversations);
router.get('/ticket/:ticketId', messageController.getMessagesByTicketId);
router.get('/:id', messageController.getMessageById);
router.post('/', validate(sendMessageValidation), messageController.sendMessage);
router.patch('/:id/read', messageController.markAsRead);
router.patch('/conversation/:conversationId/read', messageController.markConversationAsRead);
router.delete('/:id', messageController.deleteMessage);

export default router;
