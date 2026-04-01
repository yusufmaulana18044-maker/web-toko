// API configuration for development and production
const getApiUrl = () => {
  // In development, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  // In production on Vercel, use relative paths (same domain)
  // API routes are at /api/* on Vercel
  return '';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  GET_USERS: `${API_BASE_URL}/api/auth/users`,
  UPDATE_ROLE: `${API_BASE_URL}/api/auth/update-role`,
  GET_CATEGORIES: `${API_BASE_URL}/api/categories`,
  GET_PRODUCTS: `${API_BASE_URL}/api/products`,
  UPLOAD_IMAGE: `${API_BASE_URL}/api/products/upload-image`,
  GET_TRANSACTIONS: `${API_BASE_URL}/api/transactions`,
  CHECKOUT: `${API_BASE_URL}/api/transactions/checkout`,
};
