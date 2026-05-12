export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  ADMIN: {
    STATS: '/admin/stats',
    VENDORS: '/admin/vendors',
    CUSTOMERS: '/admin/customers',
  },
  VENDOR: {
    SERVICES: '/vendor/services',
    BOOKINGS: '/vendor/bookings',
  }
};

export const BASE_URL_DEV = 'http://192.168.1.2:5000/api';
export const BASE_URL_PROD = 'https://api.aquawash.saas/api';
