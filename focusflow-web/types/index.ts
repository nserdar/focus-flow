export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  dueDate?: string;
  priority: number;
  area?: string;
  createdAt: string;
  updatedAt: string;
  totalFocusSeconds: number;
  goalId?: number;
  goalTitle?: string;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  priority: number;
  area?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface FocusSession {
  id: number;
  taskId: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  type?: 'POMODORO' | 'CUSTOM';
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WeeklyPlan {
  id: number;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  tasks?: Task[];
  goals?: Goal[];
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
}

