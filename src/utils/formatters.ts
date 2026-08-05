import { format, formatDistance, startOfDay, endOfDay, parse } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Format seconds to HH:MM:SS display
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Format minutes to readable format
 */
export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
};

/**
 * Format date to display format
 */
export const formatDate = (date: Date | number, formatStr: string = 'dd/MM/yyyy'): string => {
  return format(new Date(date), formatStr);
};

/**
 * Format date relative to now
 */
export const formatRelativeDate = (date: Date | number): string => {
  return formatDistance(new Date(date), new Date(), { 
    addSuffix: true,
    locale: tr 
  });
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | number): boolean => {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(new Date(date));
  return today.getTime() === checkDate.getTime();
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date | number): boolean => {
  return new Date(date) < new Date();
};

/**
 * Get start of day timestamp
 */
export const getStartOfDay = (date: Date = new Date()): number => {
  return startOfDay(date).getTime();
};

/**
 * Get end of day timestamp
 */
export const getEndOfDay = (date: Date = new Date()): number => {
  return endOfDay(date).getTime();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffix
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
};
