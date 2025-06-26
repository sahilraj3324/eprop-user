'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import Banner from '@/components/Banner';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchProperties();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      // User not authenticated, redirect to login
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URLS.PROPERTIES);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || property.propertyType === filterType;
    return matchesSearch && matchesFilter;
  });

  const newProperties = properties.slice(-6); // Last 6 properties as "newly listed"
  const topProperties = properties.slice(0, 6); // First 6 as "top properties"

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
      <Navbar 
        user={user} 
        onSearch={setSearchTerm}
        onFilterChange={setFilterType}
        searchTerm={searchTerm}
        filterType={filterType}
      />
      
      <main>
        {/* Banner Section */}
        <Banner />

        {/* Search Results */}
        {searchTerm && (
          <section className="py-8 px-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Search Results for &quot;{searchTerm}&quot; ({filteredProperties.length} found)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </section>
        )}

        {/* All Properties Section (when no search) */}
        {!searchTerm && (
          <>
          {/* All Properties */}
          <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">All Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties
                  .filter(property => filterType === 'all' || property.propertyType === filterType)
                  .map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </section>
            
            {/* Newly Listed Properties */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Newly Listed Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </section>

            {/* Top Properties */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Top Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </section>

            
          </>
        )}
      </main>
    </div>
  );
} 