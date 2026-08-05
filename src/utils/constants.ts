// Utility constants
export const DEFAULT_FOCUS_DURATION = 25; // minutes
export const DEFAULT_SHORT_BREAK = 5; // minutes
export const DEFAULT_LONG_BREAK = 15; // minutes
export const SESSIONS_BEFORE_LONG_BREAK = 4;

// Time constants
export const SECOND_IN_MS = 1000;
export const MINUTE_IN_MS = 60 * SECOND_IN_MS;
export const HOUR_IN_MS = 60 * MINUTE_IN_MS;
export const DAY_IN_MS = 24 * HOUR_IN_MS;

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: '@focus_flow/settings',
  TASKS: '@focus_flow/tasks',
  SESSIONS: '@focus_flow/sessions',
  ACHIEVEMENTS: '@focus_flow/achievements',
  ONBOARDED: '@focus_flow/onboarded',
};

// Animation configs
export const ANIMATION_CONFIGS = {
  FAST: { duration: 150 },
  NORMAL: { duration: 300 },
  SLOW: { duration: 500 },
};

// Priorities
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Session types
export const SESSION_TYPES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'break',
  LONG_BREAK: 'longBreak',
} as const;

// Achievement thresholds
export const ACHIEVEMENT_THRESHOLDS = {
  FIRST_SESSION: 1,
  WEEK_WARRIOR: 7,
  MONTH_MASTER: 30,
  CENTURY: 100,
  PERFECT_WEEK: 7,
  STREAK_7: 7,
  STREAK_14: 14,
  STREAK_30: 30,
};

// Regular expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
};
