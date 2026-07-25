import axios from 'axios';

// Use environment variable or default to /api for dev proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // NEW: Automatically sends the httpOnly cookie with every request
});

// REMOVED: The request interceptor is completely gone! 
// The browser's native cookie management securely handles attaching the token now.

// Response interceptor: handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear auth state if we're on a protected page
      const path = window.location.pathname;
      if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
        // Token is no longer in localStorage, so we only need to clear the user data
        localStorage.removeItem('user'); 
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;