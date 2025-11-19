/**
 * Formatting utility functions
 */

/**
 * Format feature name from snake_case to Title Case
 * Example: pr_interval -> PR Interval
 * @param key - Feature key in snake_case
 * @returns Formatted feature name in Title Case
 */
export const formatFeatureName = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format probability to percentage string
 * @param probability - Probability value (0-1)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatProbability = (probability: number, decimals: number = 1): string => {
  return `${(probability * 100).toFixed(decimals)}%`;
};

/**
 * Format feature value with appropriate unit and precision
 * @param key - Feature key
 * @param value - Feature value
 * @returns Formatted feature value with unit
 */
export const formatFeatureValue = (key: string, value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  switch (key) {
    case 'heart_rate':
      return `${value.toFixed(1)} bpm`;
    
    case 'hrv_rmssd':
      return `${value.toFixed(1)} ms`;
    
    case 'qrs_duration':
      return `${(value * 1000).toFixed(1)} ms`;
    
    case 'r_amplitude':
      return `${value.toFixed(3)} mV`;
    
    case 'signal_energy':
      return `${value.toFixed(2)}`;
    
    case 'r_peaks_count':
      return `${value}`;
    
    default:
      return typeof value === 'number' ? value.toFixed(2) : String(value);
  }
};
