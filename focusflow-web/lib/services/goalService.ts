import { api } from '../api';
import { Goal, PageResponse } from '@/types';

export interface GoalRequest {
  title: string;
  description?: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  priority?: number;
  area?: string;
}

export interface GoalSearchParams {
  search?: string;
  status?: string;
  priority?: number;
  area?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const goalService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PageResponse<Goal> | Goal[]> => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Goal> => {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  create: async (data: GoalRequest): Promise<Goal> => {
    const response = await api.post<Goal>('/goals', data);
    return response.data;
  },

  update: async (id: number, data: GoalRequest): Promise<Goal> => {
    const response = await api.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  search: async (params: GoalSearchParams): Promise<PageResponse<Goal>> => {
    const response = await api.get<PageResponse<Goal>>('/goals/search', { params });
    return response.data;
  },

  getByArea: async (area: string): Promise<Goal[]> => {
    const response = await api.get<Goal[]>(`/goals/area/${area}`);
    return response.data;
  },
};

