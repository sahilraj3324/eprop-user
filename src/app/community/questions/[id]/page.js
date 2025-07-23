'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiMessageCircle, 
  FiEye,
  FiClock,
  FiTag,
  FiAward,
  FiEdit,
  FiTrash2,
  FiSend
} from 'react-icons/fi';

export default function QuestionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id, user]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/community/questions/${params.id}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question);
        setAnswers(data.answers);
      } else if (response.status === 401) {
        router.push('/auth/login');
      } else {
        setError('Failed to fetch question details');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteQuestion = async (voteType) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/community/questions/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(prev => ({
          ...prev,
          voteScore: data.voteScore,
          userVote: data.userVote,
        }));
      }
    } catch (error) {
      console.error('Error voting on question:', error);
    }
  };

  const handleVoteAnswer = async (answerId, voteType) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/community/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnswers(prev => prev.map(answer => 
          answer._id === answerId 
            ? { ...answer, voteScore: data.voteScore, userVote: data.userVote }
            : answer
        ));
      }
    } catch (error) {
      console.error('Error voting on answer:', error);
    }
  };

  const handleMarkBestAnswer = async (answerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/community/answers/${answerId}/mark-best`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchQuestion(); // Refresh to update best answer status
      }
    } catch (error) {
      console.error('Error marking best answer:', error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!newAnswer.trim()) return;

    setIsSubmittingAnswer(true);

    try {
      const response = await fetch(`http://localhost:5000/api/community/questions/${params.id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newAnswer }),
      });

      if (response.ok) {
        setNewAnswer('');
        fetchQuestion(); // Refresh to show new answer
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleAddComment = async (answerId) => {
    const commentContent = newComments[answerId];
    if (!commentContent?.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/community/answers/${answerId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        setNewComments(prev => ({ ...prev, [answerId]: '' }));
        fetchQuestion(); // Refresh to show new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

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

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Question Not Found</h3>
            <p className="text-red-600">{error || 'The requested question could not be found.'}</p>
            <Link
              href="/community"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <Link
          href="/community"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Community
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Question */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Question Header */}
            <div className="flex items-start gap-6 mb-6">
              {/* Voting */}
              <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleVoteQuestion('upvote')}
                  className={`p-2 rounded-lg transition-colors ${
                    question.userVote === 'upvote' 
                      ? 'bg-green-100 text-green-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiThumbsUp size={20} />
                </button>
                
                <span className="text-lg font-semibold text-gray-900">
                  {question.netVotes || 0}
                </span>
                
                <button
                  onClick={() => handleVoteQuestion('downvote')}
                  className={`p-2 rounded-lg transition-colors ${
                    question.userVote === 'downvote' 
                      ? 'bg-red-100 text-red-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiThumbsDown size={20} />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {question.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(question.category)}`}>
                    {question.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  
                  {question.tags && question.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                      <FiTag className="inline w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {question.content}
                  </p>
                </div>

                {/* Question Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {question.author?.profilePic ? (
                        <img 
                          src={question.author.profilePic} 
                          alt={question.author.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-xs text-white">
                            {question.author?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{question.author?.name}</span>
                    </div>
                    
                    <span>•</span>
                    
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiMessageCircle className="mr-1" />
                      <span>{answers.length} answers</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiEye className="mr-1" />
                      <span>{question.views?.count || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>

            {answers.length === 0 ? (
              <div className="text-center py-8">
                <FiMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No answers yet. Be the first to help!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {answers.map((answer) => (
                  <div key={answer._id} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                    <div className="flex items-start gap-6">
                      {/* Answer Voting */}
                      <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                        <button
                          onClick={() => handleVoteAnswer(answer._id, 'upvote')}
                          className={`p-2 rounded-lg transition-colors ${
                            answer.userVote === 'upvote' 
                              ? 'bg-green-100 text-green-600' 
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <FiThumbsUp size={18} />
                        </button>
                        
                        <span className="font-semibold text-gray-900">
                          {answer.netVotes || 0}
                        </span>
                        
                        <button
                          onClick={() => handleVoteAnswer(answer._id, 'downvote')}
                          className={`p-2 rounded-lg transition-colors ${
                            answer.userVote === 'downvote' 
                              ? 'bg-red-100 text-red-600' 
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <FiThumbsDown size={18} />
                        </button>

                        {/* Best Answer Badge */}
                        {answer.isBestAnswer && (
                          <div className="flex flex-col items-center mt-2">
                            <FiAward className="text-yellow-500 mb-1" size={20} />
                            <span className="text-xs text-yellow-700 font-medium">Best</span>
                          </div>
                        )}

                        {/* Mark as Best Answer Button */}
                        {user && question.author._id === user._id && !answer.isBestAnswer && (
                          <button
                            onClick={() => handleMarkBestAnswer(answer._id)}
                            className="mt-2 p-1 text-xs text-yellow-600 hover:text-yellow-700 border border-yellow-300 rounded"
                            title="Mark as best answer"
                          >
                            <FiAward size={14} />
                          </button>
                        )}
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1">
                        {answer.isBestAnswer && (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center text-yellow-800">
                              <FiAward className="mr-2" />
                              <span className="font-medium">Best Answer</span>
                            </div>
                          </div>
                        )}

                        <div className="prose max-w-none mb-4">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {answer.content}
                          </p>
                        </div>

                        {/* Answer Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              {answer.author?.profilePic ? (
                                <img 
                                  src={answer.author.profilePic} 
                                  alt={answer.author.name}
                                  className="w-6 h-6 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                                  <span className="text-xs text-white">
                                    {answer.author?.name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span>{answer.author?.name}</span>
                            </div>
                            
                            <span>•</span>
                            <span>{formatDate(answer.createdAt)}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setExpandedComments(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(answer._id)) {
                                  newSet.delete(answer._id);
                                } else {
                                  newSet.add(answer._id);
                                }
                                return newSet;
                              })}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {answer.comments?.length || 0} comments
                            </button>
                          </div>
                        </div>

                        {/* Comments */}
                        {expandedComments.has(answer._id) && (
                          <div className="ml-4 border-l-2 border-gray-200 pl-4">
                            {answer.comments?.map((comment) => (
                              <div key={comment._id} className="py-3 border-b border-gray-100 last:border-b-0">
                                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <span className="font-medium">{comment.author?.name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{formatDate(comment.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiThumbsUp className="mr-1" size={12} />
                                    <span>{comment.voteScore || 0}</span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Add Comment */}
                            {user && (
                              <div className="mt-4 flex">
                                <input
                                  type="text"
                                  value={newComments[answer._id] || ''}
                                  onChange={(e) => setNewComments(prev => ({
                                    ...prev,
                                    [answer._id]: e.target.value
                                  }))}
                                  placeholder="Add a comment..."
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddComment(answer._id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleAddComment(answer._id)}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                                >
                                  <FiSend size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Answer */}
          {user ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
              
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Share your knowledge and help the community..."
                />
                
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingAnswer || !newAnswer.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingAnswer ? 'Posting...' : 'Post Answer'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-gray-600 mb-4">Please log in to answer this question.</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Log In to Answer
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 