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
 * Validate age from date of birth
 */
export const validateAge = (dob: string): boolean => {
  if (!dob) return false;

  try {
    const [year, month, day] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 10 && age <= 100;
  } catch {
    return false;
  }
};
