// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private callbacks: { [key: string]: (...args: any[]) => void } = {};

  async startConnection(userId: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/chatHub?userId=${userId}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register callbacks before starting connection
    for (const method in this.callbacks) {
      this.connection.on(method, this.callbacks[method]);
    }

    try {
      await this.connection.start();
      console.log('SignalR Connected');
      return true;
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
      return false;
    }
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR Disconnected');
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      }
    }
  }

  on(method: string, callback: (...args: any[]) => void) {
    this.callbacks[method] = callback;
    
    // If connection already exists, register the callback
    if (this.connection) {
      this.connection.on(method, callback);
    }
  }

  off(method: string) {
    if (this.connection) {
      this.connection.off(method);
    }
    delete this.callbacks[method];
  }

  async invoke(method: string, ...args: any[]) {
    if (!this.connection) {
      throw new Error('Connection not started');
    }
    
    try {
      return await this.connection.invoke(method, ...args);
    } catch (err) {
      console.error(`Error invoking ${method}:`, err);
      throw err;
    }
  }

  async joinChatRoom(userId: string, roomId: string) {
    await this.invoke('JoinChatRoom', userId, roomId);
  }

  async leaveChatRoom(userId: string, roomId: string) {
    await this.invoke('LeaveChatRoom', userId, roomId);
  }

  async sendMessage(userId: string, roomId: string, message: string) {
    await this.invoke('SendMessage', userId, roomId, message);
  }

  async userIsTyping(userId: string, roomId: string) {
    await this.invoke('UserIsTyping', userId, roomId);
  }
}

// Create a singleton instance
const signalRService = new SignalRService();
export default signalRService;
