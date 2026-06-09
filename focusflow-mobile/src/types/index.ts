// Enums
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// API Response Types
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  priority: number;
  area?: string;
  createdAt: string;
  updatedAt: string;
  totalFocusSeconds?: number;
  goalId?: number;
  goalTitle?: string;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  status: GoalStatus;
  startDate?: string;
  endDate?: string;
  priority: number;
  area?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: number;
  taskId: number;
  userId: number;
  startedAt: string;
  finishedAt?: string;
  active: boolean;
  completed: boolean;
  canceled: boolean;
  durationMinutes?: number;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  userId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: number;
  area?: string;
  goalId?: number;
}

export interface GoalRequest {
  title: string;
  description?: string;
  status?: GoalStatus;
  startDate?: string;
  endDate?: string;
  priority?: number;
  area?: string;
}

export interface FocusSessionRequest {
  taskId: number;
  durationMinutes?: number;
}

