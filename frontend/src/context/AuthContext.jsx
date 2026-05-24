// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi, verifyEmail as verifyEmailApi, getProfile as getProfileApi } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  const fetchProfile = useCallback(async (t) => {
    try {
      const data = await getProfileApi();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to fetch profile', err);
      // Keep authentication state even if profile fetch fails
      // Optionally you could set a fallback user or ignore the error
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Set token in localStorage (in case it was set manually)
      localStorage.setItem('token', token);
      fetchProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (payload) => {
    try {
      const data = await loginApi(payload);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      toast.success('Login successful');
      // Navigation handled in Login component
      setLoading(false);
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (payload) => {
    try {
      const data = await registerApi(payload);
      toast.success('Registration successful, please verify your email');
      navigate('/verify-email');
      return data;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const verifyEmail = async (payload) => {
    try {
      await verifyEmailApi(payload);
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Verification failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
