import apiClient from '../config/api';
import { FocusSession, FocusSessionRequest, PageResponse } from '../types';

export const focusSessionService = {
  async getAll(page = 0, size = 20, sortBy = 'startedAt', sortDir: 'ASC' | 'DESC' = 'DESC'): Promise<PageResponse<FocusSession>> {
    const response = await apiClient.get<PageResponse<FocusSession>>('/focus-sessions', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  async getById(id: number): Promise<FocusSession> {
    const response = await apiClient.get<FocusSession>(`/focus-sessions/${id}`);
    return response.data;
  },

  async start(session: FocusSessionRequest): Promise<FocusSession> {
    const response = await apiClient.post<FocusSession>('/focus-sessions', session);
    return response.data;
  },

  async finish(id: number, session: FocusSessionRequest): Promise<FocusSession> {
    const response = await apiClient.put<FocusSession>(`/focus-sessions/${id}/finish`, session);
    return response.data;
  },

  async cancel(id: number): Promise<void> {
    await apiClient.put(`/focus-sessions/${id}/cancel`);
  },

  async getByTask(taskId: number): Promise<FocusSession[]> {
    const response = await apiClient.get<FocusSession[]>(`/focus-sessions/task/${taskId}`);
    return response.data;
  },

  async search(
    params: {
      taskId?: number;
      completed?: boolean;
      active?: boolean;
      canceled?: boolean;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: 'ASC' | 'DESC';
    }
  ): Promise<PageResponse<FocusSession>> {
    const response = await apiClient.get<PageResponse<FocusSession>>('/focus-sessions/search', {
      params,
    });
    return response.data;
  },
};

