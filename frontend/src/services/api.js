// src/services/api.js

/**
 * Generic API wrapper for the Online Voting System frontend.
 * Handles base URL (proxy /api), JWT auth header, JSON handling and error handling.
 * Optionally retries on network failures (simple exponential back‑off).
 */

export const api = async ({
  url,
  method = 'GET',
  data = null,
  auth = true,
  retry = 0,
}) => {
  const token = auth ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const fetchOptions = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const res = await fetch(url, fetchOptions);
    // Attempt to parse JSON only if response has body
    let json;
    const contentType = (res.headers && typeof res.headers.get === 'function' && res.headers.get('content-type')) || '';
    if (contentType.includes('application/json')) {
      try {
        json = await res.json();
      } catch (e) {
        // Invalid JSON
        json = null;
      }
    }
    if (!res.ok) {
      const message = json && json.message ? json.message : 'Request failed';
      const err = new Error(message);
      err.status = res.status;
      err.payload = json;
      throw err;
    }
    // If no JSON body, return empty object
    return json || {};
  } catch (err) {
    if (retry > 0 && (!err.status || err.status >= 500)) {
      // simple retry with exponential back‑off
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, 3 - retry)));
      return api({ url, method, data, auth, retry: retry - 1 });
    }
    throw err;
  }
};
