import axios from 'axios';
import { Platform } from 'react-native';

// In a real app, you might use a more robust way to manage tokens
// For now, we'll use a simple module-level variable that can be updated
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const BASE_URL = Platform.OS === 'web' 
  ? 'http://127.0.0.1:5000/api' 
  : 'http://192.168.1.2:5000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
