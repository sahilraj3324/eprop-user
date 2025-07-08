'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';
import { FiMessageCircle, FiInbox } from 'react-icons/fi';

export default function ConversationsPage() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
        if (response.data.success) {
          setUser(response.data.user);
          await Promise.all([
            fetchConversations(),
            fetchUnreadCount()
          ]);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(API_URLS.CHAT_CONVERSATIONS, API_DEFAULT_CONFIG);
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(API_URLS.CHAT_UNREAD_COUNT, API_DEFAULT_CONFIG);
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleOpenConversation = (conversation) => {
    setActiveConversation(conversation);
    setIsChatMinimized(false);
    // Refresh unread count after opening a conversation
    setTimeout(fetchUnreadCount, 1000);
  };

  const handleCloseChat = () => {
    setActiveConversation(null);
    setIsChatMinimized(false);
    // Refresh conversations and unread count
    fetchConversations();
    fetchUnreadCount();
  };

  const handleToggleMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiMessageCircle className="text-green-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">Manage your conversations with buyers and sellers</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} unread
              </div>
            )}
          </div>
        </div>

        {/* Conversations List */}
        {conversations.length > 0 ? (
          <ConversationList 
            conversations={conversations}
            currentUser={user}
            onOpenConversation={handleOpenConversation}
            onRefresh={fetchConversations}
          />
        ) : (
          <div className="text-center py-16">
            <FiInbox className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">
              Start chatting with sellers by visiting item pages and clicking "Chat with Seller"
            </p>
            <button
              onClick={() => router.push('/items')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Items
            </button>
          </div>
        )}
      </main>

      {/* Chat Window */}
      {activeConversation && (
        <ChatWindow
          conversation={activeConversation}
          user={user}
          onClose={handleCloseChat}
          isMinimized={isChatMinimized}
          onToggleMinimize={handleToggleMinimize}
        />
      )}
    </div>
  );
} 