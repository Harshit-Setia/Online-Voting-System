// src/services/resultService.js
import { api } from './api';
import { API_URL } from '../config';

// Get tally results for an election
export const getResults = async (electionId) => {
  return api({ url: `${API_URL}/results/${electionId}`, method: 'GET' });
};

// Get winner information for an election
export const getWinner = async (electionId) => {
  return api({ url: `${API_URL}/results/${electionId}/winner`, method: 'GET' });
};
