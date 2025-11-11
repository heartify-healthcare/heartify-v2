/**
 * API Configuration
 */

// Base URLs for different services
export const API_BASE_URL = 'http://192.168.1.14:8080'; // API Gateway URL
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
    ME: `${PREFIX}/auth/me`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${PREFIX}/users/profile`,
    CHANGE_PASSWORD: `${PREFIX}/users/change-password`,
    UPDATE_PROFILE: `${PREFIX}/users/profile`,
    UPDATE_HEALTH: `${PREFIX}/users/profile/health`,
  },

  // ECG endpoints
  ECG: {
    SESSIONS: `${PREFIX}/ecg-sessions`,
    SESSION_BY_ID: (id: string) => `${PREFIX}/ecg-sessions/${id}`,
    RECORDINGS: `${PREFIX}/ecg-recordings`,
    RECORDING_BY_ID: (id: string) => `${PREFIX}/ecg-recordings/${id}`,
  },

  // Prediction endpoints
  PREDICTION: {
    BY_ID: (id: string) => `${PREFIX}/predictions/${id}`,
    CREATE: `${PREFIX}/predictions`,
  },

  // Explanation endpoints
  EXPLANATION: {
    BY_ID: (id: string) => `${PREFIX}/explanations/${id}`,
    CREATE: `${PREFIX}/explanations`,
  },
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: '@heartify:token',
  USER: '@heartify:user',
};
