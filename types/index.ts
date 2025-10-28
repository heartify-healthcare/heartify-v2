/**
 * Centralized type definitions export
 */

// Health types
export type {
  UserData as HealthUserData,
  HealthFormData,
  DropdownOption,
} from './health';

// Settings types
export type {
  UserData as SettingsUserData,
  SettingsFormData,
} from './settings';

// Predictions types
export type {
  ECGSignalData,
  ECGRecording,
  PredictionFeatures,
  Prediction,
  ExplanationPrompt,
  ExplanationDetails,
  Explanation,
  ECGSession,
  ECGSessionsResponse,
  ECGSessionCardProps,
} from './predictions';

// ECG types - TODO: Add when needed

