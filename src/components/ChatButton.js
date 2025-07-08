'use client';

import { useState } from 'react';
import { FiMessageCircle, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

export default function ChatButton({ item, user, onStartChat }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartChat = async () => {
    if (!user) {
      setError('Please login to chat with seller');
      return;
    }

    if (!item.isAvailable) {
      setError('This item is no longer available');
      return;
    }

    if (item.user._id === user._id) {
      setError('You cannot chat with yourself');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(API_URLS.CHAT_CONVERSATIONS, {
        itemId: item._id
      }, API_DEFAULT_CONFIG);

      if (response.data.success) {
        onStartChat(response.data.conversation);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please try logging in again.');
      } else {
        setError(error.response?.data?.message || 'Failed to start chat');
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't show chat button if user is the seller
  if (item.user._id === user?._id) {
    return null;
  }

  // Don't show chat button if item is not available
  if (!item.isAvailable) {
    return (
      <div className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg text-center font-medium cursor-not-allowed">
        Item No Longer Available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleStartChat}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FiLoader className="animate-spin mr-2" />
            Starting Chat...
          </>
        ) : (
          <>
            <FiMessageCircle className="mr-2" />
            Chat with Seller
          </>
        )}
      </button>
      
      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-500 text-center">
        Real-time messaging for quick communication
      </div>
    </div>
  );
} 