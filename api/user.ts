/**
 * User API functions
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { User } from './auth';

// ==================== Types ====================

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateProfileRequest {
  email?: string;
  phonenumber?: string; // lowercase to match backend DTO
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface UpdateHealthRequest {
  age?: number;
  sex?: number;
  cp?: number;
  trestbps?: number;
  chol?: number;
  fbs?: number;
  restecg?: number;
  thalach?: number;
  exang?: number;
  oldpeak?: number;
  slope?: number;
  ca?: number;
  thal?: number;
}

// ==================== API Functions ====================

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to get profile',
      details: error.details,
    };
  }
};

/**
 * Update current user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  try {
    const response = await apiClient.patch<User>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to update profile',
      details: error.details,
    };
  }
};

/**
 * Update current user health information
 */
export const updateHealth = async (data: UpdateHealthRequest): Promise<User> => {
  try {
    const response = await apiClient.patch<User>(
      API_ENDPOINTS.USER.UPDATE_HEALTH,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to update health info',
      details: error.details,
    };
  }
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const response = await apiClient.put<ChangePasswordResponse>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to change password',
      details: error.details,
    };
  }
};
