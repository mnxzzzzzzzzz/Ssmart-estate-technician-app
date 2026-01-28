// Socket.IO Service for Real-time Communication

import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.utils';
import { JWTPayload } from '../types/api.types';

interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

// Store connected users
const connectedUsers = new Map<string, string>(); // userId -> socketId

// Initialize Socket.IO
export const initializeSocket = (io: SocketIOServer): void => {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.userId}`);

    if (socket.user) {
      connectedUsers.set(socket.user.userId, socket.id);

      // Join user's personal room
      socket.join(`user:${socket.user.userId}`);

      // Join role-based room
      socket.join(`role:${socket.user.role}`);
    }

    // Handle job updates
    socket.on('job:update', (data) => {
      console.log('Job update:', data);
      // Broadcast to relevant users
      io.to(`job:${data.jobId}`).emit('job:updated', data);
    });

    // Handle message sending
    socket.on('message:send', (data) => {
      console.log('Message sent:', data);
      // Broadcast to conversation participants
      if (data.receiverId) {
        io.to(`user:${data.receiverId}`).emit('message:received', data);
      }
    });

    // Handle technician location updates
    socket.on('technician:location', (data) => {
      console.log('Technician location update:', data);
      // Broadcast to operations team
      io.to('role:operations').emit('technician:location:updated', data);
    });

    // Handle typing indicators
    socket.on('typing:start', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId: socket.user?.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:stopped:typing', {
        userId: socket.user?.userId,
        conversationId: data.conversationId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.userId}`);
      if (socket.user) {
        connectedUsers.delete(socket.user.userId);
      }
    });
  });

  console.log('✅ Socket.IO initialized');
};

// Emit event to specific user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

// Emit event to specific role
export const emitToRole = (
  io: SocketIOServer,
  role: string,
  event: string,
  data: any
): void => {
  io.to(`role:${role}`).emit(event, data);
};

// Emit event to all connected users
export const emitToAll = (io: SocketIOServer, event: string, data: any): void => {
  io.emit(event, data);
};

// Check if user is online
export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId);
};

// Get online users count
export const getOnlineUsersCount = (): number => {
  return connectedUsers.size;
};
