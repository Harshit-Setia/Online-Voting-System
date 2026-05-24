// src/services/electionService.js
import { api } from './api';
import { API_URL } from '../config';

export const listElections = async () => {
  return api({ url: `${API_URL}/elections`, method: 'GET' });
};

export const createElection = async (data) => {
  return api({ url: `${API_URL}/elections`, method: 'POST', data });
};

export const getElection = async (electionId) => {
  return api({ url: `${API_URL}/elections/${electionId}`, method: 'GET' });
};

export const startElection = async (electionId) => {
  return api({ url: `${API_URL}/elections/${electionId}/start`, method: 'PATCH' });
};

export const endElection = async (electionId) => {
  return api({ url: `${API_URL}/elections/${electionId}/end`, method: 'PATCH' });
};

export const deleteElection = async (electionId) => {
  return api({ url: `${API_URL}/elections/${electionId}`, method: 'DELETE' });
};
