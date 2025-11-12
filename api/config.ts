/**
 * API Configuration
 */

// Base URLs for different services
export const API_BASE_URL = 'http://192.168.1.13:8080'; // API Gateway URL
export const PREFIX = '/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: `${PREFIX}/auth/register`,
    REQUEST_VERIFY: `${PREFIX}/auth/request-verify`,
    VERIFY: `${PREFIX}/auth/verify`,
    LOGIN: `${PREFIX}/auth/login`,
    RECOVER_PASSWORD: `${PREFIX}/auth/recover-password`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${PREFIX}/users/profile`,
    CHANGE_PASSWORD: `${PREFIX}/users/change-password`,
    UPDATE_PROFILE: `${PREFIX}/users/profile`,
    UPDATE_HEALTH: `${PREFIX}/users/profile/health`,
  },
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: '@heartify:token',
  USER: '@heartify:user',
};
