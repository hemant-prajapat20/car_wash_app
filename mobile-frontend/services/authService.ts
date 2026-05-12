import api, { setAuthToken } from './api';

export const authService = {
  async signup(data: any) {
    const response = await api.post('/auth/signup', data);
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data;
  },

  async login(data: any) {
    const response = await api.post('/auth/login', data);
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

  // Admin Only: Register a new Vendor
  async createVendor(data: any) {
    const response = await api.post('/auth/create-vendor', data);
    return response.data;
  },

  // High-Security: SuperAdmin Login via Secret Key
  async adminLogin(secretKey: string) {
    const response = await api.post('/admin/login', { secretKey });
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token);
    }
    return response.data;
  }
};

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  async getVendors() {
    const response = await api.get('/admin/vendors');
    return response.data;
  },

  async getCustomers() {
    const response = await api.get('/admin/customers');
    return response.data;
  },

  async registerVendor(data: any) {
    const response = await api.post('/admin/register-vendor', data);
    return response.data;
  },

  async toggleVendorStatus(vendorId: string) {
    const response = await api.patch(`/admin/vendors/${vendorId}/toggle`);
    return response.data;
  },

  async deleteVendor(vendorId: string) {
    const response = await api.delete(`/admin/vendors/${vendorId}`);
    return response.data;
  }
};
