import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '@shared/api/endpoints';

export const authService = {
  async login(credentials: any) {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async adminLogin(credentials: any) {
    const response = await axiosInstance.post('/auth/admin-login', credentials);
    return response.data;
  },

  async signup(userData: any) {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },

  async getProfile() {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  async logout() {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  }
};
