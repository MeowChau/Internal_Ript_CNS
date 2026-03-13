/**
 * Cache utility functions for localStorage
 */

export const CACHE_KEYS = {
  ATTENDANCE_DATA: "domixi_attendance_cache",
  ATTENDANCE_TIMESTAMP: "domixi_attendance_timestamp",
} as const;

export const CACHE_DURATION = 3 * 60 * 1000; // 3 phút

/**
 * Save data to cache with timestamp
 */
export const saveToCache = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (err) {
    console.warn(`Failed to save to cache (${key}):`, err);
  }
};

/**
 * Load data from cache if not expired
 * Returns null if cache is expired or doesn't exist
 */
export const loadFromCache = <T>(
  key: string,
  maxAge: number = CACHE_DURATION,
): T | null => {
  try {
    const cached = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      if (age < maxAge) {
        return JSON.parse(cached) as T;
      }
    }
  } catch (err) {
    console.warn(`Failed to load from cache (${key}):`, err);
  }
  return null;
};

/**
 * Clear specific cache entry
 */
export const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
  } catch (err) {
    console.warn(`Failed to clear cache (${key}):`, err);
  }
};

/**
 * Check if cache is valid (exists and not expired)
 */
export const isCacheValid = (
  key: string,
  maxAge: number = CACHE_DURATION,
): boolean => {
  try {
    const timestamp = localStorage.getItem(`${key}_timestamp`);
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp);
      return age < maxAge;
    }
  } catch (err) {
    console.warn(`Failed to check cache validity (${key}):`, err);
  }
  return false;
};
