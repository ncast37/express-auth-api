import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Don't add auth token for signup/login requests
    const isAuthRequest = config.url?.includes('/auth/signup') || config.url?.includes('/auth/login');
    
    if (!isAuthRequest) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Clear any existing authorization header for auth requests
    if (isAuthRequest && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    try {
      console.log('🚀 Sending signup request:', { email: userData.email, name: userData.name });
      
      // Use direct axios call to avoid interceptor issues
      const response = await axios.post('http://localhost:3000/api/auth/signup', userData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ Signup response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Signup error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('🚀 Sending login request:', { email: credentials.email });
      const response = await api.post('/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Login response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },
};

// Helper functions for token management
export const tokenUtils = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;
