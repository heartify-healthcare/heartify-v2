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
  dob?: string; // ISO date string (YYYY-MM-DD)
  sex?: number; // 0: Female, 1: Male
  cp?: number; // Chest pain type (0-3)
  trestbps?: number; // Resting blood pressure (mm Hg)
  exang?: number; // Exercise induced angina (0: No, 1: Yes)
}

// ==================== Response Types ====================

export interface ChangePasswordResponse {
  message: string;
}
