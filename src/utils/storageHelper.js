/**
 * Storage Helper Utility
 * Prevents QuotaExceededError crashes when writing to localStorage.
 */

export const safeSetItem = (key, value) => {
  try {
    const stringified = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringified);
  } catch (error) {
    console.warn(`[Storage Warning] Failed to write key "${key}":`, error);
    
    // QuotaExceededError Recovery: Clean up redundant legacy keys
    try {
      localStorage.removeItem('app_quotes_v1');
      localStorage.removeItem('app_quotes');
      localStorage.removeItem('app_leads');
      localStorage.removeItem('app_tasks');
      
      const stringified = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringified);
      console.log(`[Storage Recovery] Successfully saved "${key}" after clearing legacy keys.`);
    } catch (innerError) {
      console.error(`[Storage Error] Unable to save "${key}" even after recovery cleanup:`, innerError);
    }
  }
};

export const safeGetItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : fallback;
  } catch (e) {
    console.warn(`[Storage Warning] Failed to read key "${key}":`, e);
    return fallback;
  }
};
