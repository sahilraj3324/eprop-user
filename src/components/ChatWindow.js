'use client';

import { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiUser, FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import axios from 'axios';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';
import socketService from '@/config/socket';

export default function ChatWindow({ 
  conversation, 
  user, 
  onClose, 
  isMinimized, 
  onToggleMinimize 
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get the other participant (buyer or seller)
  const otherParticipant = conversation.sellerId._id === user._id 
    ? conversation.buyerId 
    : conversation.sellerId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection and fetch messages
  useEffect(() => {
    if (!conversation) return;

    let isComponentMounted = true;
    
    const initializeChat = async () => {
      try {
        // First fetch existing messages
        await fetchMessages();
        
        // Then set up socket connection
        console.log('ChatWindow - Connecting socket for user:', user._id);
        const socket = socketService.connect(user._id);
        
        // Set initial connection status
        const initialStatus = socketService.isSocketConnected();
        console.log('ChatWindow - Initial connection status:', initialStatus);
        setConnected(initialStatus);
        
        // Join conversation immediately if already connected, otherwise wait
        if (initialStatus) {
          console.log('ChatWindow - Already connected, joining conversation');
          socketService.joinConversation(conversation._id);
        } else {
          console.log('ChatWindow - Not connected, waiting for connection');
          // Wait for connection to establish
          const checkConnection = () => {
            if (isComponentMounted) {
              const currentStatus = socketService.isSocketConnected();
              if (currentStatus) {
                console.log('ChatWindow - Connection established, joining conversation');
                socketService.joinConversation(conversation._id);
                setConnected(true);
              } else {
                setTimeout(checkConnection, 200);
              }
            }
          };
          setTimeout(checkConnection, 100);
        }

      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    // Set up message listener
    const unsubscribeMessage = socketService.onMessage((messageData) => {
      console.log('ChatWindow - Received message:', messageData);
      if (messageData.conversationId === conversation._id && isComponentMounted) {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => msg._id === messageData._id);
          if (messageExists) {
            console.log('ChatWindow - Message already exists, skipping');
            return prev;
          }
          console.log('ChatWindow - Adding new message to state');
          return [...prev, messageData];
        });
      }
    });

    // Set up typing listener
    const unsubscribeTyping = socketService.onTyping((data) => {
      if (!isComponentMounted) return;
      setIsTyping(data.isTyping);
      setTypingUser(data.userName || '');
      
      if (data.isTyping) {
        // Clear typing after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          if (isComponentMounted) {
            setIsTyping(false);
            setTypingUser('');
          }
        }, 3000);
      }
    });

    // Set up connection status listener
    const unsubscribeConnection = socketService.onConnection((isConnected) => {
      if (!isComponentMounted) return;
      console.log('ChatWindow - Connection status changed:', isConnected);
      setConnected(isConnected);
    });

    // Periodically check connection status
    const connectionCheckInterval = setInterval(() => {
      if (isComponentMounted) {
        const actualStatus = socketService.refreshConnectionStatus();
        setConnected(actualStatus);
      }
    }, 2000);

    // Initialize chat
    initializeChat();

    return () => {
      isComponentMounted = false;
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeConnection();
      clearInterval(connectionCheckInterval);
      socketService.leaveConversation();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation._id, user._id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        API_URLS.CHAT_CONVERSATION_MESSAGES(conversation._id),
        API_DEFAULT_CONFIG
      );
      
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Send via socket for real-time delivery (socket handler will save to DB)
      socketService.sendMessage(
        conversation._id,
        messageText,
        user._id,
        user.name
      );

    } catch (error) {
      console.error('Error sending message:', error);
      // Re-add message to input if failed
      setNewMessage(messageText);
      
      // Fallback to API if socket fails
      try {
        await axios.post(API_URLS.CHAT_MESSAGES, {
          conversationId: conversation._id,
          message: messageText
        }, API_DEFAULT_CONFIG);
        
        // Manually add message to local state as fallback
        const fallbackMessage = {
          _id: Date.now(),
          message: messageText,
          senderId: { _id: user._id, name: user.name },
          createdAt: new Date(),
          conversationId: conversation._id,
          messageType: 'text'
        };
        setMessages(prev => [...prev, fallbackMessage]);
      } catch (apiError) {
        console.error('API fallback also failed:', apiError);
        setNewMessage(messageText); // Restore message text
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Send typing indicator
    if (connected) {
      socketService.sendTyping(conversation._id, true, user.name);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(conversation._id, false, user.name);
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border w-80 z-50">
        <div className="flex items-center justify-between p-3 bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FiUser className="text-sm" />
            <span className="font-medium text-sm">{otherParticipant.name}</span>
            {!connected && (
              <span className="w-2 h-2 bg-red-400 rounded-full" title="Disconnected"></span>
            )}
            {connected && (
              <span className="w-2 h-2 bg-green-300 rounded-full" title="Connected"></span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleMinimize}
              className="text-white hover:text-gray-200"
            >
              <FiMaximize2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
        <div className="p-3 text-sm text-gray-600">
          Chat with {otherParticipant.name} about "{conversation.itemId.title}"
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border w-96 h-96 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <FiUser />
          <div>
            <h3 className="font-medium">{otherParticipant.name}</h3>
            <p className="text-xs text-green-100">{conversation.itemId.title}</p>
          </div>
          {!connected && (
            <span className="w-2 h-2 bg-red-400 rounded-full" title="Disconnected"></span>
          )}
          {connected && (
            <span className="w-2 h-2 bg-green-300 rounded-full" title="Connected"></span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMinimize}
            className="text-white hover:text-gray-200"
          >
            <FiMinimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.senderId._id === user._id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.senderId._id === user._id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId._id === user._id ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && typingUser && typingUser !== user.name && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                  <p className="text-sm italic">{typingUser} is typing...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder={connected ? "Type a message..." : "Connecting..."}
            disabled={!connected}
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              !connected ? 'bg-gray-100 text-gray-500' : ''
            }`}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !connected}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={16} />
          </button>
        </div>
      </form>
    </div>
  );
} 