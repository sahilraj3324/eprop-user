'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

// Create context for shared state
const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default function ClientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const router = useRouter();
  const pathname = usePathname();

  // Routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isPublicRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname, isPublicRoute]);

  const checkAuth = async () => {
    try {
      const response = await axios.get(API_URLS.USER_ME, API_DEFAULT_CONFIG);
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      // User not authenticated, redirect to login
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    user,
    setUser,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't show navbar on auth pages
  if (isPublicRoute) {
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }

  // Don't render navbar if user is not authenticated
  if (!user) {
    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          user={user} 
          onSearch={setSearchTerm}
          onFilterChange={setFilterType}
          searchTerm={searchTerm}
          filterType={filterType}
        />
        {children}
      </div>
    </AppContext.Provider>
  );
} 