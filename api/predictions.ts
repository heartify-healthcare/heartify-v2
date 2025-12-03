/**
 * Predictions API functions
 */

import type {
  ECGSessionsResponse,
  ECGSession,
  ECGRecording,
  Prediction,
  Explanation,
  CreateECGSessionRequest,
  CreateECGSessionResponse,
} from '../types';
import { apiClient } from './client';
import { API_ENDPOINTS, EXTENDED_REQUEST_TIMEOUT } from './config';

// ==================== API Functions ====================

/**
 * Get ECG sessions with pagination and sorting
 */
export const getECGSessions = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDir: 'asc' | 'desc' = 'desc'
): Promise<ECGSessionsResponse> => {
  try {
    const queryParams = `?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
    const response = await apiClient.get<ECGSessionsResponse>(
      `${API_ENDPOINTS.ECG_SESSIONS}${queryParams}`
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch ECG sessions',
      details: error.details,
    };
  }
};

/**
 * Get ECG recording by ID
 */
export const getECGRecording = async (ecgId: string): Promise<ECGRecording> => {
  try {
    const response = await apiClient.get<ECGRecording>(
      `${API_ENDPOINTS.ECG_RECORDINGS}/${ecgId}`
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch ECG recording',
      details: error.details,
    };
  }
};

/**
 * Get prediction by ID
 */
export const getPrediction = async (predictionId: string): Promise<Prediction> => {
  try {
    const response = await apiClient.get<Prediction>(
      `${API_ENDPOINTS.PREDICTIONS}/${predictionId}`
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch prediction',
      details: error.details,
    };
  }
};

/**
 * Get explanation by ID
 */
export const getExplanation = async (explanationId: string): Promise<Explanation> => {
  try {
    const response = await apiClient.get<Explanation>(
      `${API_ENDPOINTS.EXPLANATIONS}/${explanationId}`
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to fetch explanation',
      details: error.details,
    };
  }
};

/**
 * Create a new ECG session with prediction and explanation
 * This endpoint processes ECG data and returns full analysis
 * Note: This may take 30-60 seconds due to ML model processing
 */
export const createECGSession = async (
  request: CreateECGSessionRequest
): Promise<CreateECGSessionResponse> => {
  try {
    const response = await apiClient.post<CreateECGSessionResponse>(
      API_ENDPOINTS.ECG_SESSIONS,
      request,
      undefined,
      EXTENDED_REQUEST_TIMEOUT // Use extended timeout for ML processing
    );
    return response;
  } catch (error: any) {
    throw {
      message: error.message || 'Failed to create ECG session',
      details: error.details,
    };
  }
};
