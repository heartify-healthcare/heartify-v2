/**
 * User related types
 */

// ==================== Request Types ====================

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

// ==================== Response Types ====================

export interface ChangePasswordResponse {
  message: string;
}
