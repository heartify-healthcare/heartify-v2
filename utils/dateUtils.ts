/**
 * Helper function to convert GMT date string to YYYY-MM-DD format
 */
export const convertGMTToYYYYMMDD = (gmtDateString: string): string => {
  if (!gmtDateString) return '';

  try {
    const date = new Date(gmtDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', gmtDateString);
      return '';
    }

    // Format to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error converting date:', error, gmtDateString);
    return '';
  }
};

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
 * Format date string to localized long format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string in "Month Day, Year" format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};
