// src/services/authService.js
import { API_URL } from '../config';
import { api } from './api';

export const register = async (payload) => {
  return api({ url: `${API_URL}/auth/register`, method: 'POST', data: payload, auth: false });
};

export const login = async (payload) => {
  return api({ url: `${API_URL}/auth/login`, method: 'POST', data: payload, auth: false });
};

export const verifyEmail = async (payload) => {
  return api({ url: `${API_URL}/auth/verify-email`, method: 'POST', data: payload, auth: false });
};

export const getProfile = async () => {
  return api({ url: `${API_URL}/users/me`, method: 'GET' });
};
