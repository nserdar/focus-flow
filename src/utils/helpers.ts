import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';

/**
 * Generate UUID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Debounce function for performance
 */
export const createDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
) => {
  return debounce(func, delay);
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return (current / total) * 100;
};

/**
 * Get random item from array
 */
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Sleep function for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await sleep(delay * Math.pow(2, attempt - 1));
      }
    }
  }

  throw lastError;
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Group array items by key
 */
export const groupBy = <T>(
  array: T[],
  keyFn: (item: T) => string | number
): Record<string | number, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string | number, T[]>);
};

/**
 * Memoize function results
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
};
