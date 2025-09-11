/**
 * Format date to Indonesian locale
 * @param {string|Date} date
 * @returns {string} Formatted date (e.g., "17 Agustus 2023")
 */
export function formatDate(date) {
  if (!date) return '-';

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', options);
  } catch (e) {
    console.error('Error formatting date:', e);
    return '-';
  }
}

/**
 * Format datetime to Indonesian locale with time
 * @param {string|Date} date
 * @returns {string} Formatted datetime (e.g., "17 Agustus 2023, 14:30 WIB")
 */
export function formatDateTime(date) {
  if (!date) return '-';

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', options);
  } catch (e) {
    console.error('Error formatting datetime:', e);
    return '-';
  }
}

/**
 * Format date to short version (e.g., "17/08/2023")
 */
export function formatShortDate(date) {
  if (!date) return '-';

  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', options);
  } catch (e) {
    console.error('Error formatting short date:', e);
    return '-';
  }
}