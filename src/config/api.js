// API Configuration
const API_CONFIG = {
  // Development URL
  BASE_URL: 'http://localhost:5000',
  
  // Production URL (uncomment when deploying)
  // BASE_URL: 'https://eprop.vercel.app',
  
  // API endpoints
  ENDPOINTS: {
    // User endpoints
    USERS: '/api/users',
    USER_LOGIN: '/api/users/login',
    USER_LOGOUT: '/api/users/logout',
    USER_ME: '/api/users/me',
    
    // Property endpoints
    PROPERTIES: '/api/properties',
    PROPERTIES_BY_USER: (userId) => `/api/properties/user/${userId}`,
    PROPERTY_BY_ID: (id) => `/api/properties/${id}`,
    
    // Residential Property endpoints
    RESIDENTIAL_PROPERTIES: '/api/residential-properties',
    RESIDENTIAL_PROPERTIES_BY_USER: (userId) => `/api/residential-properties/user/${userId}`,
    RESIDENTIAL_PROPERTY_BY_ID: (id) => `/api/residential-properties/${id}`,
    RESIDENTIAL_PROPERTY_UPDATE: (id, userId) => `/api/residential-properties/${id}/user/${userId}`,
    RESIDENTIAL_PROPERTY_DELETE: (id, userId) => `/api/residential-properties/${id}/user/${userId}`,
    
    // Commercial Property endpoints
    COMMERCIAL_PROPERTIES: '/api/commercial-properties',
    COMMERCIAL_PROPERTIES_BY_USER: (userId) => `/api/commercial-properties/user/${userId}`,
    COMMERCIAL_PROPERTY_BY_ID: (id) => `/api/commercial-properties/${id}`,
    COMMERCIAL_PROPERTY_UPDATE: (id, userId) => `/api/commercial-properties/${id}/user/${userId}`,
    COMMERCIAL_PROPERTY_DELETE: (id, userId) => `/api/commercial-properties/${id}/user/${userId}`,
    
    // Item endpoints
    ITEMS: '/api/items',
    ITEMS_BY_USER: (userId) => `/api/items/user/${userId}`,
    ITEMS_BY_CATEGORY: (category) => `/api/items/category/${category}`,
    ITEM_BY_ID: (id) => `/api/items/${id}`,
    
    // Chat endpoints
    CHAT_CONVERSATIONS: '/api/chat/conversations',
    CHAT_MESSAGES: '/api/chat/messages',
    CHAT_CONVERSATION_MESSAGES: (conversationId) => `/api/chat/conversations/${conversationId}/messages`,
    CHAT_UNREAD_COUNT: '/api/chat/unread-count',
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Pre-built API URLs for common endpoints
export const API_URLS = {
  // User URLs
  USERS: getApiUrl(API_CONFIG.ENDPOINTS.USERS),
  USER_LOGIN: getApiUrl(API_CONFIG.ENDPOINTS.USER_LOGIN),
  USER_LOGOUT: getApiUrl(API_CONFIG.ENDPOINTS.USER_LOGOUT),
  USER_ME: getApiUrl(API_CONFIG.ENDPOINTS.USER_ME),
  
  // Property URLs
  PROPERTIES: getApiUrl(API_CONFIG.ENDPOINTS.PROPERTIES),
  PROPERTIES_BY_USER: (userId) => getApiUrl(API_CONFIG.ENDPOINTS.PROPERTIES_BY_USER(userId)),
  PROPERTY_BY_ID: (id) => getApiUrl(API_CONFIG.ENDPOINTS.PROPERTY_BY_ID(id)),
  
  // Residential Property URLs
  RESIDENTIAL_PROPERTIES: getApiUrl(API_CONFIG.ENDPOINTS.RESIDENTIAL_PROPERTIES),
  RESIDENTIAL_PROPERTIES_BY_USER: (userId) => getApiUrl(API_CONFIG.ENDPOINTS.RESIDENTIAL_PROPERTIES_BY_USER(userId)),
  RESIDENTIAL_PROPERTY_BY_ID: (id) => getApiUrl(API_CONFIG.ENDPOINTS.RESIDENTIAL_PROPERTY_BY_ID(id)),
  RESIDENTIAL_PROPERTY_UPDATE: (id, userId) => getApiUrl(API_CONFIG.ENDPOINTS.RESIDENTIAL_PROPERTY_UPDATE(id, userId)),
  RESIDENTIAL_PROPERTY_DELETE: (id, userId) => getApiUrl(API_CONFIG.ENDPOINTS.RESIDENTIAL_PROPERTY_DELETE(id, userId)),
  
  // Commercial Property URLs
  COMMERCIAL_PROPERTIES: getApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL_PROPERTIES),
  COMMERCIAL_PROPERTIES_BY_USER: (userId) => getApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL_PROPERTIES_BY_USER(userId)),
  COMMERCIAL_PROPERTY_BY_ID: (id) => getApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL_PROPERTY_BY_ID(id)),
  COMMERCIAL_PROPERTY_UPDATE: (id, userId) => getApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL_PROPERTY_UPDATE(id, userId)),
  COMMERCIAL_PROPERTY_DELETE: (id, userId) => getApiUrl(API_CONFIG.ENDPOINTS.COMMERCIAL_PROPERTY_DELETE(id, userId)),
  
  // Item URLs
  ITEMS: getApiUrl(API_CONFIG.ENDPOINTS.ITEMS),
  ITEMS_BY_USER: (userId) => getApiUrl(API_CONFIG.ENDPOINTS.ITEMS_BY_USER(userId)),
  ITEMS_BY_CATEGORY: (category) => getApiUrl(API_CONFIG.ENDPOINTS.ITEMS_BY_CATEGORY(category)),
  ITEM_BY_ID: (id) => getApiUrl(API_CONFIG.ENDPOINTS.ITEM_BY_ID(id)),
  
  // Chat URLs
  CHAT_CONVERSATIONS: getApiUrl(API_CONFIG.ENDPOINTS.CHAT_CONVERSATIONS),
  CHAT_MESSAGES: getApiUrl(API_CONFIG.ENDPOINTS.CHAT_MESSAGES),
  CHAT_CONVERSATION_MESSAGES: (conversationId) => getApiUrl(API_CONFIG.ENDPOINTS.CHAT_CONVERSATION_MESSAGES(conversationId)),
  CHAT_UNREAD_COUNT: getApiUrl(API_CONFIG.ENDPOINTS.CHAT_UNREAD_COUNT),
};

// Default axios configuration
export const API_DEFAULT_CONFIG = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG; 