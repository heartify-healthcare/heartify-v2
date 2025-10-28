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
