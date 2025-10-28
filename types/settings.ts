/**
 * User data interface for settings
 */
export interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string | null;
  role: string;
  username: string;
  created_at: string;
  dob: string | null;
  cp: number | null;
  exang: number | null;
  sex: number | null;
  trestbps: number | null;
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
