/**
 * Format sex value to display string
 */
export const formatSex = (sex: number): string => {
  return sex === 1 ? 'Male' : 'Female';
};

/**
 * Format probability to percentage string
 */
export const formatProbability = (prob: number): string => {
  return `${(prob * 100).toFixed(2)}%`;
};

/**
 * Format timestamp to readable date string
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };

    return date.toLocaleDateString('en-US', options).replace(',', ' -');
  } catch (error) {
    return timestamp;
  }
};

/**
 * Get color based on prediction result
 */
export const getPredictionColor = (prediction: string): string => {
  return prediction === 'POSITIVE' ? '#e74c3c' : '#27ae60';
};
