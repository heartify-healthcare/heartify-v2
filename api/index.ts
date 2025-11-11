/**
 * API exports
 * Central export point for all API functions
 */

// Config
export { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from './config';

// Client
export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';

// Auth
export {
  register,
  requestVerify,
  verifyOtp,
  login,
  logout,
  recoverPassword,
  getCurrentUser,
  isAuthenticated,
  getToken,
} from './auth';

export type {
  RegisterRequest,
  RegisterResponse,
  RequestVerifyRequest,
  RequestVerifyResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  User,
} from './auth';

// User
export {
  getProfile,
  updateProfile,
  updateHealth,
  changePassword,
} from './user';

export type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  UpdateHealthRequest,
} from './user';
