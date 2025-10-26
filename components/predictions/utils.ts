/**
 * Utility functions for Predictions feature
 */

/**
 * Format date string to YYYY-MM-DD HH:mm format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return dateString;
  }
};

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
