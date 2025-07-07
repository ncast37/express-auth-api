import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI, tokenUtils } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenUtils.getToken();
      const savedUser = tokenUtils.getUser();

      if (token && savedUser) {
        try {
          // Verify token by fetching profile
          const response = await authAPI.getProfile();
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear it
          tokenUtils.removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup(userData);

      if (response.success) {
        const { user, token } = response.data;
        tokenUtils.setToken(token);
        tokenUtils.setUser(user);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message: errorMessage, errors };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);

      if (response.success) {
        const { user, token } = response.data;
        tokenUtils.setToken(token);
        tokenUtils.setUser(user);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const errors = error.response?.data?.errors || [];
      return { success: false, message: errorMessage, errors };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenUtils.removeToken();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
