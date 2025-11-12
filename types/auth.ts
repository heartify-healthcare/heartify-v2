/**
 * Authentication related types
 */

// ==================== Request Types ====================

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phonenumber?: string; // lowercase to match backend DTO
}

export interface RequestVerifyRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RecoverPasswordRequest {
  username: string;
  email: string;
  phoneNumber: string; // lowercase to match backend DTO
}

// ==================== Response Types ====================

export interface RegisterResponse {
  message: string;
}

export interface RequestVerifyResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  username: string;
  email: string;
  role: string;
}

export interface RecoverPasswordResponse {
  message: string;
}

// ==================== Entity Types ====================

export interface User {
  id: string;
  username: string;
  email: string;
  phonenumber?: string; // lowercase to match backend DTO
  role: string;
  isVerified?: boolean;
  createdAt: string;
  // Health fields
  dob?: string; // ISO date string (YYYY-MM-DD)
  sex?: number; // 0: Female, 1: Male
  cp?: number; // Chest pain type (0-3)
  trestbps?: number; // Resting blood pressure (mm Hg)
  exang?: number; // Exercise induced angina (0: No, 1: Yes)
}
