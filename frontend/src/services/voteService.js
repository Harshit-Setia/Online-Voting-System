// src/services/voteService.js
import { api } from './api';
import { API_URL } from '../config';

// Request OTP for a specific election
export const requestOtp = async (electionId) => {
  return api({
    url: `${API_URL}/votes/request-otp`,
    method: 'POST',
    data: { election_id: parseInt(electionId) },
  });
};

// Cast a vote with selected candidate and OTP
export const castVote = async (electionId, candidateId, otp) => {
  return api({
    url: `${API_URL}/votes`,
    method: 'POST',
    data: {
      candidate_id: parseInt(candidateId),
      election_id: parseInt(electionId),
      otp,
    },
  });
};
