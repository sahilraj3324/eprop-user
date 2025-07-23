'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { API_URLS, API_DEFAULT_CONFIG } from '@/config/api';

function LoginContent() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success message from signup
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (formData.phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URLS.USER_LOGIN, {
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      }, API_DEFAULT_CONFIG);

      if (response.data.success) {
        // Successfully logged in
        console.log('Login successful:', response.data);
        setUserInfo(response.data.user);
        setShowUserInfo(true);
        
        // Show user info briefly, then redirect
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeDisplay = (userType) => {
    const types = {
      buyer: { icon: '🏠', label: 'Property Buyer', color: 'text-blue-600' },
      seller: { icon: '🏢', label: 'Property Seller/Owner', color: 'text-green-600' },
      agent: { icon: '👤', label: 'Real Estate Agent', color: 'text-purple-600' },
      admin: { icon: '⚡', label: 'Administrator', color: 'text-red-600' }
    };
    
    return types[userType] || { icon: '👤', label: 'User', color: 'text-gray-600' };
  };

  if (showUserInfo && userInfo) {
    const userType = getUserTypeDisplay(userInfo.user_type);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Login Successful!</h2>
            <p className="mt-2 text-sm text-gray-600">Welcome back to the platform</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{userInfo.name}</h3>
              <p className="text-sm text-gray-600">{userInfo.phoneNumber}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <span className={`text-sm font-medium ${userType.color} flex items-center`}>
                  <span className="mr-1">{userType.icon}</span>
                  {userType.label}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone Verified</span>
                <span className={`text-sm flex items-center ${userInfo.is_verified ? 'text-green-600' : 'text-orange-600'}`}>
                  {userInfo.is_verified ? (
                    <>
                      <FiCheck className="mr-1" size={14} />
                      Verified
                    </>
                  ) : (
                    <>
                      <FiAlertCircle className="mr-1" size={14} />
                      Pending
                    </>
                  )}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aadhar Verified</span>
                <span className={`text-sm flex items-center ${userInfo.is_aadhar_verified ? 'text-green-600' : 'text-gray-400'}`}>
                  {userInfo.is_aadhar_verified ? (
                    <>
                      <FiCheck className="mr-1" size={14} />
                      Verified
                    </>
                  ) : (
                    <>
                      <FiX className="mr-1" size={14} />
                      Not Verified
                    </>
                  )}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 text-center">
                Redirecting to dashboard in 3 seconds...
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Access your property listings and dashboard
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Create one here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                minLength="10"
                maxLength="15"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="9876543210 or +919876543210"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6 bg-gray-50 rounded-md p-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-gray-700 mb-2">🧪 Demo Credentials</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Buyer:</strong> 9876543210 / password123</p>
                <p><strong>Seller:</strong> 9876543211 / password123</p>
                <p><strong>Agent:</strong> 9876543212 / password123</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="text-xs text-blue-800 text-center">
              <p className="font-medium mb-1">🔐 Account Security</p>
              <p>Your login is secured and encrypted. Check your verification status after login.</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 