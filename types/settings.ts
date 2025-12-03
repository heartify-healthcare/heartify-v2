/**
 * User data interface for settings
 */
export interface UserData {
  email: string;
  id: string; // UUID from backend
  is_verified: boolean;
  phonenumber?: string;
  role: string;
  username: string;
  created_at: string;
  dob?: string;
  cp?: number;
  exang?: number;
  sex?: number;
  trestbps?: number;
}

/**
 * Settings form data interface
 */
export interface SettingsFormData {
  username: string;
  email: string;
  phonenumber: string;
  role: string;
}
