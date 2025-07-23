'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';
import PropertyCard from '@/components/PropertyCard';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'residential', 'commercial'
  const [filters, setFilters] = useState({
    city: '',
    looking_for: '',
    min_cost: '',
    max_cost: '',
    property_type: '',
    bhk_rk: '',
    possession_status: '',
    ownership: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 12
  });
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, [activeTab, filters, pagination.current_page]);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    
    try {
      let allProperties = [];
      
      if (activeTab === 'all' || activeTab === 'residential') {
        const resParams = new URLSearchParams({
          page: pagination.current_page,
          limit: pagination.items_per_page,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        });
        
        const resResponse = await axios.get(
          `${API_URLS.RESIDENTIAL_PROPERTIES}?${resParams}`,
          API_DEFAULT_CONFIG
        );
        
        if (resResponse.data.success) {
          const residentialProps = resResponse.data.data.map(prop => ({
            ...prop,
            propertyCategory: 'residential'
          }));
          allProperties = [...allProperties, ...residentialProps];
        }
      }
      
      if (activeTab === 'all' || activeTab === 'commercial') {
        const comParams = new URLSearchParams({
          page: pagination.current_page,
          limit: pagination.items_per_page,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        });
        
        const comResponse = await axios.get(
          `${API_URLS.COMMERCIAL_PROPERTIES}?${comParams}`,
          API_DEFAULT_CONFIG
        );
        
        if (comResponse.data.success) {
          const commercialProps = comResponse.data.data.map(prop => ({
            ...prop,
            propertyCategory: 'commercial'
          }));
          allProperties = [...allProperties, ...commercialProps];
        }
      }
      
      // Sort by put_on_top and creation date
      allProperties.sort((a, b) => {
        if (a.put_on_top && !b.put_on_top) return -1;
        if (!a.put_on_top && b.put_on_top) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setProperties(allProperties);
      
      // Update pagination (using residential data as reference)
      if (activeTab === 'residential') {
        const resParams = new URLSearchParams({
          page: pagination.current_page,
          limit: pagination.items_per_page,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        });
        const resResponse = await axios.get(
          `${API_URLS.RESIDENTIAL_PROPERTIES}?${resParams}`,
          API_DEFAULT_CONFIG
        );
        if (resResponse.data.success && resResponse.data.pagination) {
          setPagination(resResponse.data.pagination);
        }
      } else if (activeTab === 'commercial') {
        const comParams = new URLSearchParams({
          page: pagination.current_page,
          limit: pagination.items_per_page,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
        });
        const comResponse = await axios.get(
          `${API_URLS.COMMERCIAL_PROPERTIES}?${comParams}`,
          API_DEFAULT_CONFIG
        );
        if (comResponse.data.success && comResponse.data.pagination) {
          setPagination(comResponse.data.pagination);
        }
      }
      
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      looking_for: '',
      min_cost: '',
      max_cost: '',
      property_type: '',
      bhk_rk: '',
      possession_status: '',
      ownership: ''
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="text-gray-600 mt-1">
                Find your perfect residential or commercial property
              </p>
            </div>
            <button
              onClick={() => router.push('/properties/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Property Type Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Properties' },
                { key: 'residential', label: 'Residential' },
                { key: 'commercial', label: 'Commercial' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Enter city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
                <select
                  name="looking_for"
                  value={filters.looking_for}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                  <option value="lease">Lease</option>
                </select>
              </div>

              {activeTab !== 'commercial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BHK/RK</label>
                  <select
                    name="bhk_rk"
                    value={filters.bhk_rk}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="1RK">1RK</option>
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="5BHK">5BHK</option>
                    <option value="5+BHK">5+BHK</option>
                  </select>
                </div>
              )}

              {activeTab === 'commercial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ownership</label>
                  <select
                    name="ownership"
                    value={filters.ownership}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="freehold">Freehold</option>
                    <option value="leasehold">Leasehold</option>
                    <option value="co_operative_society">Co-operative Society</option>
                    <option value="power_of_attorney">Power of Attorney</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="min_cost"
                  value={filters.min_cost}
                  onChange={handleFilterChange}
                  placeholder="₹ Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="max_cost"
                  value={filters.max_cost}
                  onChange={handleFilterChange}
                  placeholder="₹ Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
              <div className="text-sm text-gray-600">
                {properties.length} properties found
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard 
                    key={`${property.propertyCategory}-${property._id}`} 
                    property={property} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No properties found</div>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            )}

            {/* Pagination */}
            {properties.length > 0 && pagination.total_pages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {pagination.current_page} of {pagination.total_pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.total_pages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 