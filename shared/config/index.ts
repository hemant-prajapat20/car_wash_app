export const APP_CONFIG = {
  DEV_API_URL: 'http://192.168.1.2:5000/api',
  PROD_API_URL: 'https://api.aquawash.saas/api',
  AUTH_TOKEN_KEY: 'aquawash_auth_token',
  USER_STORAGE_KEY: 'aquawash_user_data',
};

export const getApiUrl = (isProd: boolean = false) => {
  return isProd ? APP_CONFIG.PROD_API_URL : APP_CONFIG.DEV_API_URL;
};
