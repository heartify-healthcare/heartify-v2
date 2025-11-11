import { ECGSession } from '@/types';

/**
 * Mock ECG Sessions Data
 * Based on GET /ecg-sessions response from z-api-test.md
 */
export const mockECGSessions: ECGSession[] = [
  {
    id: "5fa9f3ad-5cd7-427e-b323-c875f22e75c7",
    userId: "cc17917d-40b0-4a11-84d6-4b03bfa759c5",
    deviceId: "device-12345-abcde",
    ecgId: "1c3bbbbf-510d-47f2-8b88-720b0b6d8b54",
    predictionId: "6df5aef2-6daf-447e-89d6-768e5a5b5124",
    explanationId: "02423ca3-2694-4ef2-923b-14a45bf042ce",
    createdAt: "2025-10-27T02:07:45.878",
    ecgRecording: null,
    prediction: null,
    explanation: null
  },
  {
    id: "edf8e4dd-cf16-46ed-8fab-f057c052c713",
    userId: "cc17917d-40b0-4a11-84d6-4b03bfa759c5",
    deviceId: "device-12345-abcde",
    ecgId: "887e1433-7fca-4228-9e17-e89d81c51394",
    predictionId: "4f6d87ab-8fd6-4ca6-918d-492de5cccc71",
    explanationId: "ae24cd93-aa5b-40dd-a5cb-48c836f12b63",
    createdAt: "2025-10-27T02:07:44.308",
    ecgRecording: null,
    prediction: null,
    explanation: null
  },
  {
    id: "f61dd989-ffe0-4ca5-b3b9-668bb76ff515",
    userId: "cc17917d-40b0-4a11-84d6-4b03bfa759c5",
    deviceId: "device-12345-abcde",
    ecgId: "347031ff-24d7-415e-ae81-b2211aef50cd",
    predictionId: "1b74188d-bfd2-4f55-81df-2f8bf8bd8d83",
    explanationId: "2f5c44ea-4ded-4c11-a4b1-eb554f401c37",
    createdAt: "2025-10-27T02:05:52.729",
    ecgRecording: null,
    prediction: null,
    explanation: null
  }
];

/**
 * Mock Detailed Data
 * Simulates responses from:
 * - GET /ecg-recordings/{ecg_id}
 * - GET /predictions/{prediction_id}
 * - GET /explanations/{explanation_id}
 */
export const mockDetailedData: { [key: string]: any } = {
  "1c3bbbbf-510d-47f2-8b88-720b0b6d8b54": {
    ecgRecording: {
      id: "1c3bbbbf-510d-47f2-8b88-720b0b6d8b54",
      rawData: {
        signal: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8],
        lead: "II",
        duration: 10
      },
      denoisedData: {
        signal: [0.52, 0.61, 0.71, 0.81, 0.91, 1.02, 0.91, 0.81],
        lead: "II",
        duration: 10
      },
      samplingRate: 130,
      recordedAt: "2025-10-27T02:07:45.844"
    },
    prediction: {
      id: "6df5aef2-6daf-447e-89d6-768e5a5b5124",
      modelVersion: 1,
      diagnosis: "Normal Sinus Rhythm",
      probability: 0.9542,
      features: {
        heart_rate: 72.5,
        hrv_rmssd: 42.3,
        qrs_duration: 0.092,
        r_amplitude: 1.234,
        signal_energy: 156.7823,
        r_peaks_count: 12
      },
      createdAt: "2025-10-27T02:07:45.856"
    },
    explanation: {
      id: "02423ca3-2694-4ef2-923b-14a45bf042ce",
      llmModelVersion: 1,
      prompt: {
        features: {
          heart_rate: 72.5,
          hrv_rmssd: 42.3,
          qrs_duration: 0.092,
          r_amplitude: 1.234,
          signal_energy: 156.7823,
          r_peaks_count: 12
        },
        probability: 0.9542,
        diagnosis: "Normal Sinus Rhythm"
      },
      explanation: {
        summary: "Your ECG shows a normal sinus rhythm with good regularity.",
        recommendation: "Continue regular check-ups and maintain a healthy lifestyle.",
        details: "All cardiac intervals are within normal limits. No signs of arrhythmia detected."
      },
      createdAt: "2025-10-27T02:07:45.866"
    }
  },
  "887e1433-7fca-4228-9e17-e89d81c51394": {
    ecgRecording: {
      id: "887e1433-7fca-4228-9e17-e89d81c51394",
      rawData: {
        signal: [0.4, 0.7, 0.9, 1.1, 0.95, 0.8, 0.6, 0.5],
        lead: "II",
        duration: 10
      },
      denoisedData: {
        signal: [0.42, 0.71, 0.91, 1.11, 0.96, 0.82, 0.62, 0.52],
        lead: "II",
        duration: 10
      },
      samplingRate: 130,
      recordedAt: "2025-10-27T02:07:44.280"
    },
    prediction: {
      id: "4f6d87ab-8fd6-4ca6-918d-492de5cccc71",
      modelVersion: 1,
      diagnosis: "Abnormal ECG Pattern",
      probability: 0.8734,
      features: {
        heart_rate: 95.2,
        hrv_rmssd: 28.7,
        qrs_duration: 0.105,
        r_amplitude: 1.567,
        signal_energy: 203.4521,
        r_peaks_count: 16
      },
      createdAt: "2025-10-27T02:07:44.290"
    },
    explanation: {
      id: "ae24cd93-aa5b-40dd-a5cb-48c836f12b63",
      llmModelVersion: 1,
      prompt: {
        features: {
          heart_rate: 95.2,
          hrv_rmssd: 28.7,
          qrs_duration: 0.105,
          r_amplitude: 1.567,
          signal_energy: 203.4521,
          r_peaks_count: 16
        },
        probability: 0.8734,
        diagnosis: "Abnormal ECG Pattern"
      },
      explanation: {
        summary: "Your ECG indicates irregular heart rhythm that requires attention.",
        recommendation: "Please consult with a cardiologist for proper evaluation and treatment options.",
        details: "Irregular R-R intervals detected. Heart rate is elevated. This requires medical attention."
      },
      createdAt: "2025-10-27T02:07:44.295"
    }
  },
  "347031ff-24d7-415e-ae81-b2211aef50cd": {
    ecgRecording: {
      id: "347031ff-24d7-415e-ae81-b2211aef50cd",
      rawData: {
        signal: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8],
        lead: "II",
        duration: 10
      },
      denoisedData: {
        signal: [0.52, 0.61, 0.71, 0.81, 0.91, 1.02, 0.91, 0.81],
        lead: "II",
        duration: 10
      },
      samplingRate: 130,
      recordedAt: "2025-10-27T02:05:52.438"
    },
    prediction: {
      id: "1b74188d-bfd2-4f55-81df-2f8bf8bd8d83",
      modelVersion: 1,
      diagnosis: "Normal Sinus Rhythm",
      probability: 0.9621,
      features: {
        heart_rate: 68.3,
        hrv_rmssd: 51.2,
        qrs_duration: 0.088,
        r_amplitude: 1.156,
        signal_energy: 142.3345,
        r_peaks_count: 11
      },
      createdAt: "2025-10-27T02:05:52.675"
    },
    explanation: {
      id: "2f5c44ea-4ded-4c11-a4b1-eb554f401c37",
      llmModelVersion: 1,
      prompt: {
        features: {
          heart_rate: 68.3,
          hrv_rmssd: 51.2,
          qrs_duration: 0.088,
          r_amplitude: 1.156,
          signal_energy: 142.3345,
          r_peaks_count: 11
        },
        probability: 0.9621,
        diagnosis: "Normal Sinus Rhythm"
      },
      explanation: {
        summary: "Your ECG shows a normal sinus rhythm with good regularity.",
        recommendation: "Continue regular check-ups and maintain a healthy lifestyle.",
        details: "All cardiac intervals are within normal limits. No signs of arrhythmia detected."
      },
      createdAt: "2025-10-27T02:05:52.699"
    }
  }
};
