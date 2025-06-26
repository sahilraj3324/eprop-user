'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { FiMapPin, FiTag, FiUser, FiPhone, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

export default function ItemDetail() {
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
        if (response.data.success) {
          setUser(response.data.user);
          await fetchItem();
        }
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [params.id, router]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(API_URLS.ITEM_BY_ID(params.id), API_DEFAULT_CONFIG);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      router.push('/items');
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
    return null;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
            <button
              onClick={() => router.push('/items')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Items
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-96 bg-gray-200">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FiTag size={64} />
                  </div>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                    <p className="text-green-600 text-sm font-medium">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{formatPrice(item.price)}</div>
                  {!item.isAvailable && (
                    <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Sold
                    </span>
                  )}
                </div>
              </div>

              {/* Item Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiTag className="mx-auto mb-2 text-gray-600" size={20} />
                  <div className="text-sm text-gray-600">Condition</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </div>
                </div>
                {item.brand && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Brand</div>
                    <div className="font-medium">{item.brand}</div>
                  </div>
                )}
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiMapPin className="mx-auto mb-2 text-gray-600" size={20} />
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium">{item.location}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="mx-auto mb-2 text-gray-600" size={20} />
                  <div className="text-sm text-gray-600">Listed</div>
                  <div className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{item.location}</span>
                  {item.city && <span>, {item.city}</span>}
                  {item.state && <span>, {item.state}</span>}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Owner Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Contact Seller</h3>
              
              {item.user && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FiUser className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{item.user.name}</div>
                      <div className="text-sm text-gray-500">Seller</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FiPhone className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{item.user.phoneNumber}</div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                    </div>
                  </div>

                  {item.isAvailable && (
                    <div className="space-y-3 pt-4 border-t">
                      <a
                        href={`tel:${item.user.phoneNumber}`}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <FiPhone className="mr-2" />
                        Call Seller
                      </a>
                      <a
                        href={`sms:${item.user.phoneNumber}?body=Hi, I'm interested in your item: ${item.title}`}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        📱 Send SMS
                      </a>
                    </div>
                  )}

                  {!item.isAvailable && (
                    <div className="pt-4 border-t">
                      <div className="bg-red-100 text-red-800 py-3 px-4 rounded-lg text-center font-medium">
                        This item is no longer available
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 