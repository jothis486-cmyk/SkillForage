import axios from 'axios';

// TASK 1: Read base API URL from Vite environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://skillforage-ojpn.onrender.com';

// Configure default axios for backward compatibility
axios.defaults.baseURL = API_URL;

// Create centralized axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000, // Render free tier can take 20-30s on cold start
});

// TASK 5: Request interceptor to attach JWT Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to extract clean user-friendly error messages (TASK 6)
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // If server responded with a status code outside 2xx
  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    switch (status) {
      case 400:
        return serverMessage || 'Invalid request. Please check your form fields.';
      case 401:
        return serverMessage || 'Invalid credentials or session expired. Please log in again.';
      case 403:
        return serverMessage || 'Access forbidden. You do not have permission for this resource.';
      case 404:
        return serverMessage || 'Requested service or resource not found.';
      case 500:
        return serverMessage || 'Backend server encountered an error. Please try again in a few moments.';
      case 502:
      case 503:
      case 504:
        return serverMessage || 'Backend server is temporarily waking up or unavailable. Please wait 15 seconds and retry.';
      default:
        return serverMessage || `Server returned error (${status}).`;
    }
  }

  // Network error, CORS error, or backend spin-down
  if (error.request) {
    return 'Unable to connect to backend server. The cloud service may be waking up or your network is offline. Please retry.';
  }

  return error.message || 'Request failed. Please check your internet connection.';
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export { API_URL };
export default api;
