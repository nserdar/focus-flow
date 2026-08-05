// Type definitions for Focus Flow app
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  targetPomodoros: number;
  completedPomodoros: number;
  dueDate?: number;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Session {
  id: string;
  taskId: string;
  duration: number; // in minutes
  type: 'focus' | 'break' | 'longBreak';
  startTime: number;
  endTime: number;
  completed: boolean;
  interruptedAt?: number;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  totalFocusTime: number; // in minutes
  totalBreakTime: number;
  sessionsCompleted: number;
  tasksCompleted: number;
  streakCount: number;
  avgFocusQuality: number; // 0-100
}

export interface UserSettings {
  focusDuration: number; // default: 25
  shortBreakDuration: number; // default: 5
  longBreakDuration: number; // default: 15
  sessionsBeforeLongBreak: number; // default: 4
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  darkMode: boolean;
  autoStartBreaks: boolean;
  autoStartSessions: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress: number;
  target: number;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number; // in seconds
  currentSession: 'focus' | 'break' | 'longBreak';
  sessionsCompleted: number;
  currentTaskId?: string;
}

export interface AppState {
  timer: TimerState;
  tasks: Task[];
  sessions: Session[];
  stats: DailyStat[];
  settings: UserSettings;
  achievements: Achievement[];
  ui: {
    selectedTab: string;
    isOnboarded: boolean;
  };
}
