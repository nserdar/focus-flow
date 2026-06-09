import { api } from '../api';
import { Task, PageResponse, TaskRequest } from '@/types';

export interface TaskSearchParams {
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

export const taskService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PageResponse<Task> | Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: TaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: TaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  search: async (params: TaskSearchParams): Promise<PageResponse<Task>> => {
    const response = await api.get<PageResponse<Task>>('/tasks/search', { params });
    return response.data;
  },

  getByWeek: async (start: string, end: string): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/week', {
      params: { start, end },
    });
    return response.data;
  },
};

export interface TaskRequest {
  title: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  dueDate?: string;
  priority?: number;
  area?: string;
  goalId?: number;
}

