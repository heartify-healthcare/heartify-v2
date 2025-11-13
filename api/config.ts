/**
 * API Configuration
 */

import { 
  API_BASE_URL as ENV_API_BASE_URL, 
  API_PREFIX as ENV_API_PREFIX, 
  REQUEST_TIMEOUT as ENV_REQUEST_TIMEOUT,
  STORAGE_PREFIX as ENV_STORAGE_PREFIX 
} from '@env';

// Base URLs for different services
export const API_BASE_URL = ENV_API_BASE_URL; // API Gateway URL
export const PREFIX = ENV_API_PREFIX;

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
export const REQUEST_TIMEOUT = parseInt(ENV_REQUEST_TIMEOUT); // in millisecond

// Storage keys
const STORAGE_PREFIX_VALUE = ENV_STORAGE_PREFIX || '@heartify';
export const STORAGE_KEYS = {
  TOKEN: `${STORAGE_PREFIX_VALUE}:token`,
  USER: `${STORAGE_PREFIX_VALUE}:user`,
};
