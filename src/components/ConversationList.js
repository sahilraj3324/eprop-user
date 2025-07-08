'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMessageCircle, FiClock, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

export default function ConversationList({ 
  conversations, 
  currentUser, 
  onOpenConversation, 
  onRefresh 
}) {
  const [unreadCounts, setUnreadCounts] = useState({});

  // Calculate unread counts for each conversation
  useEffect(() => {
    const calculateUnreadCounts = async () => {
      const counts = {};
      
      for (const conversation of conversations) {
        try {
          // Get the user's role in this conversation
          const isSellerField = conversation.sellerId._id === currentUser._id;
          const lastReadTime = isSellerField 
            ? conversation.readStatus?.seller 
            : conversation.readStatus?.buyer;

          // For now, we'll use a simple check based on lastMessageAt
          // You could also make an API call to get exact unread count
          const hasUnread = new Date(conversation.lastMessageAt) > new Date(lastReadTime || 0);
          counts[conversation._id] = hasUnread ? 1 : 0;
        } catch (error) {
          console.error('Error calculating unread for conversation:', conversation._id, error);
          counts[conversation._id] = 0;
        }
      }
      
      setUnreadCounts(counts);
    };

    if (conversations.length > 0) {
      calculateUnreadCounts();
    }
  }, [conversations, currentUser._id]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.sellerId._id === currentUser._id 
      ? conversation.buyerId 
      : conversation.sellerId;
  };

  const getUserRole = (conversation) => {
    return conversation.sellerId._id === currentUser._id ? 'Seller' : 'Buyer';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const userRole = getUserRole(conversation);
        const hasUnread = unreadCounts[conversation._id] > 0;

        return (
          <div
            key={conversation._id}
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${
              hasUnread ? 'border-l-green-500 bg-green-50' : 'border-l-gray-200'
            }`}
            onClick={() => onOpenConversation(conversation)}
          >
            {/* Item Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                {conversation.itemId.images && conversation.itemId.images.length > 0 ? (
                  <img
                    src={conversation.itemId.images[0]}
                    alt={conversation.itemId.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {conversation.itemId.title}
                  </h3>
                  <p className="text-green-600 font-medium">
                    {formatPrice(conversation.itemId.price)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.itemId.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {conversation.itemId.isAvailable ? 'Available' : 'Sold'}
                    </span>
                    <span className="text-xs text-gray-500">
                      You are the {userRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <FiUser className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{otherParticipant.name}</p>
                    <p className="text-sm text-gray-500">{otherParticipant.phoneNumber}</p>
                  </div>
                </div>
                
                {hasUnread && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>

              {/* Last Message */}
              {conversation.lastMessage && (
                <div className="mb-3">
                  <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                    &quot;{conversation.lastMessage}&quot;
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <FiClock size={12} />
                  <span>{formatTime(conversation.lastMessageAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FiMessageCircle size={12} />
                    <span>Chat</span>
                  </div>
                  {hasUnread && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <FiEye size={12} />
                      <span>New</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 