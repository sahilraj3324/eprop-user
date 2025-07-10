'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { ArrowLeft, Calendar, User, Share2, Clock, Eye } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/?id=${params.id}`);
      setBlog(response.data);
      
      // Calculate reading time (average 200 words per minute)
      if (response.data.content) {
        const wordCount = response.data.content.split(/\s+/).length;
        setReadingTime(Math.ceil(wordCount / 200));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to fetch blog');
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition duration-200"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </Link>
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              {error || 'Blog not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition duration-200"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>

          {/* Blog Article */}
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Featured Image */}
            {blog.image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-semibold">{blog.author}</span>
                </div>
                
                {blog.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                )}
                
                {readingTime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{readingTime} min read</span>
                  </div>
                )}
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition duration-200"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>

              {/* Description */}
              <div className="text-xl text-gray-700 mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
                {blog.description}
              </div>

              {/* Content */}
              <div className="prose prose-lg prose-blue max-w-none mb-10">
                <div 
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  className="text-gray-800 leading-relaxed"
                />
              </div>

              {/* Code Section */}
              {(blog.exampleCode || blog.code) && (
                <div className="mt-12">
                  <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-t-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {blog.exampleCode || 'Code Example'}
                    </h2>
                    <p className="text-gray-300">
                      Here&apos;s the code implementation for this tutorial
                    </p>
                  </div>
                  
                  {blog.code && (
                    <div className="rounded-b-xl overflow-hidden border-2 border-t-0 border-gray-900">
                      <CodeMirror
                        value={blog.code}
                        theme={oneDark}
                        editable={false}
                        className="text-sm"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Fira Code, Monaco, Menlo, monospace'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Author Bio */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">About the Author</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {blog.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{blog.author}</p>
                      <p className="text-gray-600">Content Writer & Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              <Eye size={20} />
              Explore More Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 