import { io, Socket } from 'socket.io-client';

// Replace with your computer's local IP address for physical device testing
const SOCKET_URL = 'http://192.168.1.12:5001'; 

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('⚡ Mobile Connected to Notification Socket');
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Mobile Disconnected from Notification Socket');
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
