/**
 * User data interface with health information
 */
export interface UserData {
  email: string;
  id: number;
  is_verified: boolean;
  phonenumber: string;
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
 * Health form data interface
 */
export interface HealthFormData {
  dob: string;
  cp: number | undefined;
  exang: number | undefined;
  sex: number | undefined;
  trestbps: string;
}

/**
 * Dropdown option interface for health dropdowns
 */
export interface DropdownOption {
  label: string;
  value: number;
}
