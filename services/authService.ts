import api, { setAuthToken } from './api';

/**
 * Authentication Service
 * Resolves module './api' via root tsconfig.json
 */
export const authService = {
  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data;
  },

  async signup(userData: any) {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    setAuthToken(null);
    return response.data;
  },

  async adminLogin(secretKey: string) {
    const response = await api.post('/auth/admin-login', { secretKey });
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data;
  }
};
