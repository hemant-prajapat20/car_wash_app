import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Central API configuration for the Chakachak SaaS platform
// Uses production backend URL in builds, fallback to local for dev
const PRODUCTION_API = process.env.EXPO_PUBLIC_API_URL || 'https://car-wash-app-3.onrender.com/api';

const api = axios.create({
  baseURL: PRODUCTION_API,
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
