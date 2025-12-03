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
  heart_rate?: number | null;
  hrv_rmssd?: number | null;
  qrs_duration?: number | null;
  r_amplitude?: number | null;
  signal_energy?: number | null;
  r_peaks_count?: number | null;
  [key: string]: number | null | undefined; // Allow additional features
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
  details: string;
  recommendations: string;
  risk_level: string;
  next_steps: string;
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
  // Loading states for progressive data fetching
  loadingState?: {
    ecgRecording: 'idle' | 'loading' | 'loaded' | 'error';
    prediction: 'idle' | 'loading' | 'loaded' | 'error';
    explanation: 'idle' | 'loading' | 'loaded' | 'error';
  };
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

/**
 * Request body for creating a new ECG session
 */
export interface CreateECGSessionRequest {
  deviceId: string;
  rawData: {
    signal: number[];
    lead: string;
    duration: number;
  };
  samplingRate: number;
}

/**
 * Response from creating an ECG session
 */
export interface CreateECGSessionResponse extends ECGSession {
  ecgRecording: ECGRecording;
  prediction: Prediction;
  explanation: Explanation;
}
