import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user: newUser, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      const response = await userAPI.deleteProfile(password);
      
      if (response.success) {
        // Clear user data and logout
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
