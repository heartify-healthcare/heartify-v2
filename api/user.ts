/**
 * User API functions
 */

import type {
  User,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  UpdateHealthRequest,
} from '../types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

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
