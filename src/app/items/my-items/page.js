'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

function MyItemsContent() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
        if (response.data.success) {
          setUser(response.data.user);
          
          // Fetch user's items
          const itemsResponse = await axios.get(API_URLS.ITEMS_BY_USER(response.data.user._id), API_DEFAULT_CONFIG);
          setItems(itemsResponse.data);
        }
      } catch (error) {
        // User not authenticated, redirect to login
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
    
    // Check for success message from URL params
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
      // Clear the URL parameter
      setTimeout(() => {
        router.replace('/items/my-items');
      }, 100);
    }
  }, [searchParams, router]);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(itemId);
    try {
      await axios.delete(API_URLS.ITEM_BY_ID(itemId), API_DEFAULT_CONFIG);
      
      // Remove item from local state
      setItems(items.filter(item => item._id !== itemId));
      
      // Show success message
      setSuccessMessage('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    setToggleLoading(itemId);
    try {
      const updatedItem = await axios.put(API_URLS.ITEM_BY_ID(itemId), {
        isAvailable: !currentStatus
      }, API_DEFAULT_CONFIG);
      
      // Update item in local state
      setItems(items.map(item => 
        item._id === itemId 
          ? { ...item, isAvailable: !currentStatus }
          : item
      ));
      
      setSuccessMessage(`Item marked as ${!currentStatus ? 'available' : 'sold'}`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item status. Please try again.');
    } finally {
      setToggleLoading(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'electronics':
        return '📱';
      case 'furniture':
        return '🪑';
      case 'clothing':
        return '👕';
      case 'books':
        return '📚';
      case 'vehicles':
        return '🚗';
      case 'appliances':
        return '🏠';
      case 'sports':
        return '⚽';
      case 'toys':
        return '🧸';
      default:
        return '📦';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
            <p className="text-gray-600 mt-2">
              Manage your item listings ({items.length} items)
            </p>
          </div>
          <Link
            href="/items/create"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Item
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
            <button 
              onClick={() => setSuccessMessage('')}
              className="float-right text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FiPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by listing your first item for sale.
              </p>
              <div className="mt-6">
                <Link
                  href="/items/create"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add Item
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Item Image */}
                <div className="h-48 bg-gray-200 relative">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
                    {getCategoryIcon(item.category)} {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(item.price)}
                  </div>
                  {!item.isAvailable && (
                    <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sold
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    📍 {item.location}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Link
                        href={`/items/${item._id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <FiEye className="mr-1" size={14} />
                        View
                      </Link>
                      <Link
                        href={`/items/edit/${item._id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit className="mr-1" size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        disabled={deleteLoading === item._id}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleteLoading === item._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FiTrash2 className="mr-1" size={14} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Toggle Availability */}
                    <button
                      onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                      disabled={toggleLoading === item._id}
                      className={`w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                        item.isAvailable 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {toggleLoading === item._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          {item.isAvailable ? (
                            <>
                              <FiToggleRight className="mr-1" size={14} />
                              Mark as Sold
                            </>
                          ) : (
                            <>
                              <FiToggleLeft className="mr-1" size={14} />
                              Mark as Available
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyItems() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    }>
      <MyItemsContent />
    </Suspense>
  );
} 