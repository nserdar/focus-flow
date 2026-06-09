import { api } from '../api';
import { FocusSession, PageResponse } from '@/types';

export interface FocusSessionRequest {
  taskId: number;
  durationMinutes?: number;
  type?: 'POMODORO' | 'CUSTOM';
  startTime: string;
  endTime?: string;
}

export interface FocusSessionSearchParams {
  taskId?: number;
  completed?: boolean;
  active?: boolean;
  canceled?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const focusSessionService = {
  start: async (data: FocusSessionRequest): Promise<FocusSession> => {
    const response = await api.post<FocusSession>('/focus-sessions', data);
    return response.data;
  },

  finish: async (id: number, data: FocusSessionRequest): Promise<FocusSession> => {
    const response = await api.put<FocusSession>(`/focus-sessions/${id}/finish`, data);
    return response.data;
  },

  getById: async (id: number): Promise<FocusSession> => {
    const response = await api.get<FocusSession>(`/focus-sessions/${id}`);
    return response.data;
  },

  getByTask: async (taskId: number): Promise<FocusSession[]> => {
    const response = await api.get<FocusSession[]>(`/focus-sessions/task/${taskId}`);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PageResponse<FocusSession>> => {
    // Map sortBy to backend field name
    const backendParams = params ? {
      ...params,
      sortBy: params.sortBy === 'startTime' ? 'startedAt' : 
              params.sortBy === 'endTime' ? 'finishedAt' : 
              params.sortBy || 'startedAt'
    } : { sortBy: 'startedAt' };
    const response = await api.get<PageResponse<FocusSession>>('/focus-sessions', { params: backendParams });
    return response.data;
  },

  search: async (params: FocusSessionSearchParams): Promise<PageResponse<FocusSession>> => {
    const response = await api.get<PageResponse<FocusSession>>('/focus-sessions/search', { params });
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await api.put(`/focus-sessions/${id}/cancel`);
  },
};

