/**
 * Maximum number of data points to display in the live ECG chart
 */
export const MAX_DATA_POINTS = 500;

/**
 * Required number of ECG samples for prediction (backend requirement)
 */
export const REQUIRED_ECG_SAMPLES = 1300;

/**
 * Sampling rate from Polar H10 device (Hz)
 */
export const POLAR_SAMPLING_RATE = 130;

/**
 * Recording duration in seconds to get 1300 samples at 130Hz
 */
export const RECORDING_DURATION_SECONDS = 10; // 130 samples/sec * 10 sec = 1300 samples
