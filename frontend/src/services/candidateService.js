// src/services/candidateService.js
import { api } from './api';
import { API_URL } from '../config';

export const listCandidates = async (electionId) => {
  return api({ url: `${API_URL}/candidates/${electionId}`, method: 'GET' });
};

export const addCandidate = async (electionId, data) => {
  // expects FormData for photo upload
  return api({ url: `${API_URL}/candidates/`, method: 'POST', data, auth: true });
};

export const deleteCandidate = async (candidateId) => {
  return api({ url: `${API_URL}/candidates/${candidateId}`, method: 'DELETE' });
};

// New function to update candidate active status
export const updateCandidateStatus = async (candidateId, isActive) => {
  return api({
    url: `${API_URL}/candidates/${candidateId}`,
    method: 'PUT',
    data: JSON.stringify({ is_active: isActive }),
    headers: { 'Content-Type': 'application/json' },
    auth: true
  });
};
