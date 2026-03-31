// API configuration that works in development and production
const getApiUrl = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  // In production, use environment variable
  return process.env.REACT_APP_API_URL || 'https://your-backend-url.com';
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
  CHECKOUT: `${API_BASE_URL}/transactions/user/checkout`,
};
