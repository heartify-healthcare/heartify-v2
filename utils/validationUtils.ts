/**
 * Validation utility functions
 */

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
