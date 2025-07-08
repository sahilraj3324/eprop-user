import { io } from 'socket.io-client';
import API_CONFIG from './api';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentConversation = null;
    this.messageCallbacks = [];
    this.typingCallbacks = [];
    this.connectionCallbacks = [];
  }

  // Initialize socket connection
  connect(userId) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected, reusing connection');
      return this.socket;
    }

    // Clean up existing socket if any
    if (this.socket) {
      console.log('Cleaning up existing disconnected socket');
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    console.log('Creating new socket connection');
    this.socket = io(API_CONFIG.BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      
      // Authenticate with user ID
      if (userId) {
        this.socket.emit('authenticate', userId);
      }
      
      // Notify connection callbacks immediately
      this.connectionCallbacks.forEach(callback => {
        try {
          callback(true);
        } catch (error) {
          console.error('Error in connection callback:', error);
        }
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
      this.connectionCallbacks.forEach(callback => callback(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.connectionCallbacks.forEach(callback => callback(false));
    });

    // Listen for incoming messages from others
    this.socket.on('receive-message', (messageData) => {
      console.log('Received message from other user:', messageData);
      this.messageCallbacks.forEach(callback => callback(messageData));
    });

    // Listen for message sent confirmation (for sender)
    this.socket.on('message-sent', (messageData) => {
      console.log('Message sent confirmation:', messageData);
      this.messageCallbacks.forEach(callback => callback(messageData));
    });

    // Listen for typing indicators
    this.socket.on('user-typing', (data) => {
      this.typingCallbacks.forEach(callback => callback(data));
    });

    // Listen for message errors
    this.socket.on('message-error', (error) => {
      console.error('Message error:', error);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentConversation = null;
    }
  }

  // Join a conversation room
  joinConversation(conversationId) {
    if (this.socket && this.isConnected) {
      // Leave current conversation if any
      if (this.currentConversation && this.currentConversation !== conversationId) {
        this.socket.emit('leave-conversation', this.currentConversation);
      }
      
      this.currentConversation = conversationId;
      this.socket.emit('join-conversation', conversationId);
      console.log(`Joined conversation: ${conversationId}`);
    }
  }

  // Leave current conversation
  leaveConversation() {
    if (this.socket && this.isConnected && this.currentConversation) {
      this.socket.emit('leave-conversation', this.currentConversation);
      this.currentConversation = null;
    }
  }

  // Send a message
  sendMessage(conversationId, message, senderId, senderName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', {
        conversationId,
        message,
        senderId,
        senderName
      });
    }
  }

  // Send typing indicator
  sendTyping(conversationId, isTyping, userName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        conversationId,
        isTyping,
        userName
      });
    }
  }

  // Subscribe to message events
  onMessage(callback) {
    this.messageCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to typing events
  onTyping(callback) {
    this.typingCallbacks.push(callback);
    
    return () => {
      this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to connection events
  onConnection(callback) {
    this.connectionCallbacks.push(callback);
    
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  // Get connection status
  isSocketConnected() {
    return this.socket && this.socket.connected && this.isConnected;
  }

  // Get current conversation
  getCurrentConversation() {
    return this.currentConversation;
  }

  // Force refresh connection status
  refreshConnectionStatus() {
    const actuallyConnected = this.socket && this.socket.connected;
    if (this.isConnected !== actuallyConnected) {
      this.isConnected = actuallyConnected;
      this.connectionCallbacks.forEach(callback => {
        try {
          callback(actuallyConnected);
        } catch (error) {
          console.error('Error in connection callback:', error);
        }
      });
    }
    return actuallyConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 