/**
 * Utility function untuk clear semua auth data dari localStorage
 * Gunakan ini di Login.jsx, Logout, dan tempat lain yang perlu clear auth
 */
export const clearAuthStorage = () => {
  try {
    // Remove specific keys
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Also remove any other auth-related keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.toLowerCase().includes('auth') || 
                   key.toLowerCase().includes('user') || 
                   key.toLowerCase().includes('token') ||
                   key.toLowerCase().includes('jwt'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error(`Error removing key ${key}:`, err);
      }
    });
    
    return true;
  } catch (err) {
    console.error("Error clearing auth storage:", err);
    return false;
  }
};

/**
 * Utility function untuk get user data dari localStorage
 */
export const getUserFromStorage = () => {
  try {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  } catch (err) {
    console.error("Error parsing user from storage:", err);
    return null;
  }
};

/**
 * Utility function untuk set user data ke localStorage
 */
export const setUserToStorage = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (err) {
    console.error("Error setting user to storage:", err);
    return false;
  }
};

/**
 * Utility function untuk set token ke localStorage
 */
export const setTokenToStorage = (token) => {
  try {
    localStorage.setItem("token", token);
    return true;
  } catch (err) {
    console.error("Error setting token to storage:", err);
    return false;
  }
};

/**
 * Utility function untuk get token dari localStorage
 */
export const getTokenFromStorage = () => {
  try {
    return localStorage.getItem("token");
  } catch (err) {
    console.error("Error getting token from storage:", err);
    return null;
  }
};
