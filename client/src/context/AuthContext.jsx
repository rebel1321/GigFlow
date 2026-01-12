import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setState({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Logged in successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Account created successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Logged out successfully');
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
