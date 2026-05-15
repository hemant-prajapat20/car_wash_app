import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development, you can restrict this later
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('⚡ New Socket Connection:', socket.id);

    // Join a private room for the user based on their ID
    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their private room`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket Disconnected');
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
