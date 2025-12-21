/**
 * Authentication API functions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
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
} from '../types';
import { apiClient } from './client';
import { API_ENDPOINTS, STORAGE_KEYS } from './config';

// ==================== API Functions ====================

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Registration failed',
      details: error.details,
    };
  }
};

/**
 * Request OTP verification email
 */
export const requestVerify = async (
  data: RequestVerifyRequest
): Promise<RequestVerifyResponse> => {
  try {
    const response = await apiClient.post<RequestVerifyResponse>(
      API_ENDPOINTS.AUTH.REQUEST_VERIFY,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to send verification email',
      details: error.details,
    };
  }
};

/**
 * Verify OTP code
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiClient.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'OTP verification failed',
      details: error.details,
    };
  }
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Store token, user info, and login timestamp
    if (response.accessToken) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response));
      await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_TIME, Date.now().toString());
    }

    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Login failed',
      details: error.details,
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_TIME);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Check if user is authenticated and token is still valid (within 24 hours)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    const loginTimeStr = await AsyncStorage.getItem(STORAGE_KEYS.LOGIN_TIME);
    
    if (!token || !loginTimeStr) {
      return false;
    }
    
    const loginTime = parseInt(loginTimeStr, 10);
    const currentTime = Date.now();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Check if token is still valid (within 24 hours)
    if (currentTime - loginTime > twentyFourHoursInMs) {
      // Token expired, clear storage
      await logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Recover password (forgot password)
 */
export const recoverPassword = async (
  data: RecoverPasswordRequest
): Promise<RecoverPasswordResponse> => {
  try {
    const response = await apiClient.post<RecoverPasswordResponse>(
      API_ENDPOINTS.AUTH.RECOVER_PASSWORD,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Password recovery failed',
      details: error.details,
    };
  }
};
