/**
 * Type definitions for Predictions feature
 * These types are based on the API responses from z-api-test.md
 */

export interface ECGSignalData {
  signal: number[];
  lead: string;
  duration: number;
}

export interface ECGRecording {
  id: string;
  rawData: ECGSignalData;
  denoisedData: ECGSignalData;
  samplingRate: number;
  recordedAt: string;
}

export interface PredictionFeatures {
  pr_interval: number;
  heart_rate: number;
  qrs_duration: number;
  [key: string]: number; // Allow additional features
}

export interface Prediction {
  id: string;
  modelVersion: number;
  diagnosis: string;
  probability: number;
  features: PredictionFeatures;
  createdAt: string;
}

export interface ExplanationPrompt {
  features: PredictionFeatures;
  probability: number;
  diagnosis: string;
}

export interface ExplanationDetails {
  summary: string;
  recommendation: string;
  details: string;
}

export interface Explanation {
  id: string;
  llmModelVersion: number;
  prompt: ExplanationPrompt;
  explanation: ExplanationDetails;
  createdAt: string;
}

export interface ECGSession {
  id: string;
  userId: string;
  deviceId: string;
  ecgId: string;
  predictionId: string;
  explanationId: string;
  createdAt: string;
  ecgRecording?: ECGRecording | null;
  prediction?: Prediction | null;
  explanation?: Explanation | null;
}

export interface ECGSessionsResponse {
  content: ECGSession[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

/**
 * Props interface for ECGSessionCard component
 */
export interface ECGSessionCardProps {
  session: ECGSession;
  index: number;
  styles: any;
  onExpand?: (sessionId: string) => void;
}
