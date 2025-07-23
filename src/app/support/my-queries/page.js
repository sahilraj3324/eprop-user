'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyQueriesPage() {
  const router = useRouter();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queries/my-queries', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setQueries(data.queries);
      } else if (response.status === 401) {
        router.push('/auth/login');
      } else {
        setError('Failed to fetch queries');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'urgent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRateQuery = (query) => {
    setSelectedQuery(query);
    setShowRatingModal(true);
    setRating(0);
    setFeedback('');
  };

  const submitRating = async () => {
    if (rating === 0) return;

    setSubmittingRating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/queries/${selectedQuery._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rating, feedback }),
      });

      if (response.ok) {
        setShowRatingModal(false);
        fetchQueries(); // Refresh queries
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Support Queries</h1>
            <p className="text-gray-600">Track and manage your support requests</p>
          </div>
          <button
            onClick={() => router.push('/support')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Submit New Query
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {queries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No queries yet</h3>
            <p className="text-gray-600 mb-6">You haven't submitted any support queries.</p>
            <button
              onClick={() => router.push('/support')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Your First Query
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {queries.map((query) => (
              <div key={query._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {query.subject}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {query.message.length > 200 
                            ? `${query.message.substring(0, 200)}...` 
                            : query.message
                          }
                        </p>
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className={`px-3 py-1 rounded-full border font-medium ${getStatusColor(query.status)}`}>
                            {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(query.priority)}`}>
                            {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)} Priority
                          </span>
                          
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {query.category.charAt(0).toUpperCase() + query.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {query.adminResponse?.message && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-blue-900">Admin Response</span>
                          {query.adminResponse.respondedAt && (
                            <span className="text-blue-600 text-sm">
                              • {formatDate(query.adminResponse.respondedAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-blue-800">
                          {query.adminResponse.message}
                        </p>
                      </div>
                    )}

                    {query.userSatisfaction?.rating && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= query.userSatisfaction.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-green-800 font-medium">
                              Your Rating: {query.userSatisfaction.rating}/5
                            </span>
                          </div>
                        </div>
                        {query.userSatisfaction.feedback && (
                          <p className="text-green-700 text-sm">
                            "{query.userSatisfaction.feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500 mb-2">
                      Created: {formatDate(query.createdAt)}
                    </p>
                    
                    {query.status === 'resolved' && !query.userSatisfaction?.rating && (
                      <button
                        onClick={() => handleRateQuery(query)}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Rate Service
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rate Our Service
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-3">
                  How satisfied are you with our response to your query?
                </p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Share your thoughts about our service..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRating}
                  disabled={rating === 0 || submittingRating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 