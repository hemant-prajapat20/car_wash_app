import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Central API configuration for the Chakachak SaaS platform
// Using the local IP address for mobile-to-backend communication
const api = axios.create({
  baseURL: 'http://192.168.1.12:5001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Automatically attach JWT token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 [API Request] ${config.method?.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.status} <- ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ [API Error] ${error.config?.url}:`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Clear token and handle logout if session expires
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
