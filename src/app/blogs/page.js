'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Calendar, User, Eye, Code, ChevronRight } from 'lucide-react';

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs/');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover insights, tips, and stories about real estate, technology, and more
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2a1 1 0 01-1 1H6a1 1 0 01-1-1v-2h8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs available</h3>
              <p className="text-gray-500">Check back later for new content!</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Featured Blog */}
            {blogs.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="md:flex">
                    {blogs[0].image && (
                      <div className="md:w-1/2">
                        <img
                          src={blogs[0].image}
                          alt={blogs[0].title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`${blogs[0].image ? 'md:w-1/2' : 'w-full'} p-8`}>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>{blogs[0].author}</span>
                        </div>
                        {blogs[0].createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{formatDate(blogs[0].createdAt)}</span>
                          </div>
                        )}
                        {blogs[0].exampleCode && (
                          <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            <Code size={14} />
                            <span>Code</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {blogs[0].title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {blogs[0].description}
                      </p>
                      
                      <Link
                        href={`/blogs/${blogs[0]._id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
                      >
                        Read More
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Blogs Grid */}
            {blogs.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Articles</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.slice(1).map((blog) => (
                    <article key={blog._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                      {blog.image && (
                        <div className="relative overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {blog.exampleCode && (
                            <div className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-lg">
                              <Code size={16} />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{blog.author}</span>
                          </div>
                          {blog.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(blog.createdAt)}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.description}
                        </p>
                        
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition duration-200"
                        >
                          Read More
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 