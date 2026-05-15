import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('⚡ Connected to Notification Socket');
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Notification Socket');
    });
  }

  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification_received', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
