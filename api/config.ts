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

  // ECG & Predictions endpoints
  ECG_SESSIONS: `${PREFIX}/ecg-sessions`,
  ECG_RECORDINGS: `${PREFIX}/ecg-recordings`,
  PREDICTIONS: `${PREFIX}/predictions`,
  EXPLANATIONS: `${PREFIX}/explanations`,
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // in millisecond

// Extended timeout for long-running operations (e.g., ECG session creation with ML processing)
export const EXTENDED_REQUEST_TIMEOUT = 120000; // 120 seconds (2 minutes)

// Storage keys
const STORAGE_PREFIX_VALUE = '@heartify';
export const STORAGE_KEYS = {
  TOKEN: `${STORAGE_PREFIX_VALUE}:token`,
  USER: `${STORAGE_PREFIX_VALUE}:user`,
};
