'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

function MyPropertiesContent() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
        if (response.data.success) {
          setUser(response.data.user);
          await fetchUserProperties(response.data.user._id);
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
        router.replace('/properties/my-properties');
      }, 100);
    }
  }, [searchParams, router]);

  const fetchUserProperties = async (userId) => {
    try {
      let allProperties = [];

      // Fetch residential properties
      try {
        const resResponse = await axios.get(API_URLS.RESIDENTIAL_PROPERTIES_BY_USER(userId), API_DEFAULT_CONFIG);
        if (resResponse.data.success) {
          const residentialProps = resResponse.data.data.map(prop => ({
            ...prop,
            propertyCategory: 'residential'
          }));
          allProperties = [...allProperties, ...residentialProps];
        }
      } catch (error) {
        console.log('No residential properties found or error:', error.message);
      }

      // Fetch commercial properties
      try {
        const comResponse = await axios.get(API_URLS.COMMERCIAL_PROPERTIES_BY_USER(userId), API_DEFAULT_CONFIG);
        if (comResponse.data.success) {
          const commercialProps = comResponse.data.data.map(prop => ({
            ...prop,
            propertyCategory: 'commercial'
          }));
          allProperties = [...allProperties, ...commercialProps];
        }
      } catch (error) {
        console.log('No commercial properties found or error:', error.message);
      }

      // Fetch legacy properties as fallback
      try {
        const legacyResponse = await axios.get(API_URLS.PROPERTIES_BY_USER(userId), API_DEFAULT_CONFIG);
        const legacyProps = legacyResponse.data.map(prop => ({
          ...prop,
          propertyCategory: 'legacy'
        }));
        allProperties = [...allProperties, ...legacyProps];
      } catch (error) {
        console.log('No legacy properties found or error:', error.message);
      }

      // Sort by creation date (newest first) and featured properties on top
      allProperties.sort((a, b) => {
        if (a.put_on_top && !b.put_on_top) return -1;
        if (!a.put_on_top && b.put_on_top) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setProperties(allProperties);
    } catch (error) {
      console.error('Error fetching user properties:', error);
    }
  };

  const handleDeleteProperty = async (propertyId, propertyCategory, userId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(propertyId);
    try {
      let deleteUrl;
      
      // Determine the correct delete endpoint based on property type
      if (propertyCategory === 'residential') {
        deleteUrl = API_URLS.RESIDENTIAL_PROPERTY_DELETE(propertyId, userId);
      } else if (propertyCategory === 'commercial') {
        deleteUrl = API_URLS.COMMERCIAL_PROPERTY_DELETE(propertyId, userId);
      } else {
        // Legacy property
        deleteUrl = API_URLS.PROPERTY_BY_ID(propertyId);
      }

      await axios.delete(deleteUrl, API_DEFAULT_CONFIG);
      
      // Remove property from local state
      setProperties(properties.filter(property => property._id !== propertyId));
      
      // Show success message
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not specified';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Get property data based on type
  const getPropertyDisplayData = (property) => {
    if (property.propertyCategory === 'residential') {
      return {
        title: property.name || 'Residential Property',
        price: property.cost,
        description: property.descriptions,
        location: `${property.locality}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Residential',
        lookingFor: property.looking_for,
        area: property.build_up_area,
        areaUnit: property.area_unit,
        bhk: property.bhk_rk,
        rent: property.rent,
        categoryIcon: '🏠',
        statusColor: 'bg-blue-100 text-blue-800'
      };
    } else if (property.propertyCategory === 'commercial') {
      return {
        title: property.your_name || 'Commercial Property',
        price: property.cost,
        description: property.description,
        location: `${property.locality}, ${property.city}`,
        propertyType: property.property_type,
        category: 'Commercial',
        lookingFor: property.looking_to,
        area: property.build_up_area,
        areaUnit: property.build_up_area_unit,
        floor: property.your_floor,
        totalFloors: property.total_floor,
        ownership: property.ownership,
        monthlyRent: property.monthly_rent,
        categoryIcon: '🏢',
        statusColor: 'bg-green-100 text-green-800'
      };
    }
    
    // Legacy property structure
    return {
      title: property.title || 'Property',
      price: property.price,
      description: property.description,
      location: property.address || property.city,
      propertyType: property.propertyType,
      category: 'Property',
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      categoryIcon: '🏠',
      statusColor: 'bg-gray-100 text-gray-800'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-600 mt-2">
              Manage your property listings ({properties.length} properties)
            </p>
          </div>
          <Link
            href="/properties/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Property
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

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FiPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first property listing.
              </p>
              <div className="mt-6">
                <Link
                  href="/properties/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add Property
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const displayData = getPropertyDisplayData(property);
              return (
                <div key={`${property.propertyCategory}-${property._id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Property Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={displayData.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-6xl">{displayData.categoryIcon}</span>
                      </div>
                    )}
                    
                    {/* Property Category Badge */}
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {displayData.categoryIcon} {displayData.category}
                    </div>
                    
                    {/* Looking For Badge */}
                    {displayData.lookingFor && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium uppercase">
                        {displayData.lookingFor}
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    {property.put_on_top && (
                      <div className="absolute top-12 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {displayData.title}
                    </h3>
                    {displayData.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {displayData.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                      📍 {displayData.location}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(displayData.price)}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${displayData.statusColor}`}>
                        {displayData.propertyType}
                      </span>
                    </div>

                    {/* Property Features */}
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      {property.propertyCategory === 'residential' && (
                        <>
                          <span>{displayData.bhk || 'N/A'}</span>
                          <span>📐 {displayData.area} {displayData.areaUnit}</span>
                          {displayData.rent && (
                            <span>₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(displayData.rent)}/mo</span>
                          )}
                        </>
                      )}
                      
                      {property.propertyCategory === 'commercial' && (
                        <>
                          <span>📐 {displayData.area} {displayData.areaUnit}</span>
                          {displayData.floor && displayData.totalFloors && (
                            <span>🏢 Floor {displayData.floor}/{displayData.totalFloors}</span>
                          )}
                          {displayData.ownership && (
                            <span>{displayData.ownership.replace('_', ' ')}</span>
                          )}
                        </>
                      )}
                      
                      {property.propertyCategory === 'legacy' && (
                        <>
                          <span>🛏️ {displayData.bedrooms || 0} Beds</span>
                          <span>🚿 {displayData.bathrooms || 0} Baths</span>
                          <span>📐 {displayData.area || 'N/A'}</span>
                        </>
                      )}
                    </div>

                    {/* Monthly Rent for Commercial */}
                    {property.propertyCategory === 'commercial' && displayData.monthlyRent && (
                      <div className="text-sm text-gray-600 mb-4">
                        Monthly Rent: ₹{new Intl.NumberFormat('en-IN').format(displayData.monthlyRent)}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/properties/${property._id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <FiEye className="mr-1" size={14} />
                        View
                      </Link>
                      <Link
                        href={`/properties/edit/${property._id}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <FiEdit className="mr-1" size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id, property.propertyCategory, user._id)}
                        disabled={deleteLoading === property._id}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deleteLoading === property._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FiTrash2 className="mr-1" size={14} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function MyProperties() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MyPropertiesContent />
    </Suspense>
  );
} 