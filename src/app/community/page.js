'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiSearch, 
  FiPlus, 
  FiMessageCircle, 
  FiThumbsUp, 
  FiEye, 
  FiClock,
  FiTrendingUp,
  FiTag,
  FiFilter
} from 'react-icons/fi';

export default function CommunityPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'recent',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:5000/api/community/questions?${queryParams}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'property-buying', label: 'Property Buying' },
    { value: 'property-selling', label: 'Property Selling' },
    { value: 'rental', label: 'Rental' },
    { value: 'investment', label: 'Investment' },
    { value: 'legal', label: 'Legal' },
    { value: 'financing', label: 'Financing' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'technology', label: 'Technology' },
    { value: 'market-trends', label: 'Market Trends' },
    { value: 'general', label: 'General' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: FiClock },
    { value: 'popular', label: 'Most Popular', icon: FiTrendingUp },
    { value: 'mostAnswered', label: 'Most Answered', icon: FiMessageCircle },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'property-buying': 'bg-blue-100 text-blue-700',
      'property-selling': 'bg-green-100 text-green-700',
      'rental': 'bg-purple-100 text-purple-700',
      'investment': 'bg-yellow-100 text-yellow-700',
      'legal': 'bg-red-100 text-red-700',
      'financing': 'bg-indigo-100 text-indigo-700',
      'maintenance': 'bg-gray-100 text-gray-700',
      'technology': 'bg-pink-100 text-pink-700',
      'market-trends': 'bg-orange-100 text-orange-700',
      'general': 'bg-teal-100 text-teal-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Q&A
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Ask questions, share knowledge, and get answers from our community of property experts and users.
          </p>
          
          <Link
            href="/community/ask"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <FiPlus className="mr-2" />
            Ask a Question
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFilter className="inline mr-1" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  sortBy: 'recent',
                  page: 1,
                  limit: 10
                })}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiMessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.category !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Be the first to ask a question in our community!'
                }
              </p>
              <Link
                href="/community/ask"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Ask the First Question
              </Link>
            </div>
          ) : (
            questions.map((question) => (
              <div key={question._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Vote Score */}
                  <div className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
                      <FiThumbsUp className="text-blue-600 mb-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        {question.netVotes || 0}
                      </span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        href={`/community/questions/${question._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {question.title}
                      </Link>
                      
                      {question.isPinned && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {question.content}
                    </p>

                    {/* Tags and Category */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(question.category)}`}>
                        {categories.find(c => c.value === question.category)?.label || question.category}
                      </span>
                      
                      {question.tags && question.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          <FiTag className="inline w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      
                      {question.tags && question.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{question.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Author and Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {question.author?.profilePic ? (
                            <img 
                              src={question.author.profilePic} 
                              alt={question.author.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                              <span className="text-xs text-white">
                                {question.author?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span>{question.author?.name}</span>
                        </div>
                        
                        <span>•</span>
                        <span>{formatDate(question.createdAt)}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiMessageCircle className="mr-1" />
                          <span>{question.answerCount || 0} answers</span>
                        </div>
                        
                        <div className="flex items-center">
                          <FiEye className="mr-1" />
                          <span>{question.views?.count || 0} views</span>
                        </div>

                        {question.bestAnswer && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            ✓ Answered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handleFilterChange('page', Math.min(pagination.totalPages, filters.page + 1))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 