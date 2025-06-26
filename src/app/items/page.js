'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

function ItemsContent() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
        if (response.data.success) {
          setUser(response.data.user);
          
          // Fetch all items
          const itemsResponse = await axios.get(API_URLS.ITEMS, API_DEFAULT_CONFIG);
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
  }, [router]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'appliances', label: 'Appliances' },
    { value: 'sports', label: 'Sports' },
    { value: 'toys', label: 'Toys' },
    { value: 'other', label: 'Other' },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter && item.isAvailable;
  });

  const newItems = items.filter(item => item.isAvailable).slice(-6); // Last 6 available items
  const featuredItems = items.filter(item => item.isAvailable).slice(0, 6); // First 6 as featured

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
      
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Amazing Items</h1>
            <p className="text-xl mb-8">Buy and sell items in your local area</p>
            
            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {searchTerm && (
          <section className="py-8 px-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Search Results for &quot;{searchTerm}&quot; ({filteredItems.length} found)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* All Items Section (when no search) */}
        {!searchTerm && (
          <>
            {/* All Items */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">All Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items
                  .filter(item => (filterCategory === 'all' || item.category === filterCategory) && item.isAvailable)
                  .map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
              </div>
            </section>
            
            {/* Recently Listed Items */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Recently Listed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </section>

            {/* Featured Items */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Featured Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && searchTerm && (
          <section className="py-16 px-4 max-w-7xl mx-auto text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or browse different categories.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function Items() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
} 