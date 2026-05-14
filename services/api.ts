import axios from 'axios';

// Professional API configuration for the Chakachak SaaS platform
const api = axios.create({
  baseURL: 'http://192.168.1.2:5000/api', // Points to your computer's IP for mobile access
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Request interceptor for security
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
