// API configuration for development and production
const getApiUrl = () => {
  // Environment variables
  const envApiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL;
  
  // If env var is set, use it (for Vercel deployment)
  if (envApiUrl) {
    console.log('📡 Using API URL from env:', envApiUrl);
    return envApiUrl;
  }

  // In development, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🏠 Using localhost API');
    return 'http://localhost:5000';
  }

  // In production, if on Vercel, try to use same domain with /api prefix
  // Or set REACT_APP_API_URL in Vercel environment variables
  if (window.location.hostname.includes('vercel.app')) {
    console.log('📦 Running on Vercel - backend must be configured separately');
    // Fallback to same origin with /api prefix
    return `${window.location.protocol}//${window.location.host}/api`;
  }

  // Default fallback
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  GET_USERS: `${API_BASE_URL}/auth/users`,
  UPDATE_ROLE: `${API_BASE_URL}/auth/update-role`,
  GET_CATEGORIES: `${API_BASE_URL}/categories`,
  GET_PRODUCTS: `${API_BASE_URL}/products`,
  UPLOAD_IMAGE: `${API_BASE_URL}/products/upload-image`,
  GET_TRANSACTIONS: `${API_BASE_URL}/transactions`,
  CHECKOUT: `${API_BASE_URL}/api/orders`,
};
