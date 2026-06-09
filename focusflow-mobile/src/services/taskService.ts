import apiClient from '../config/api';
import { Task, TaskRequest, PageResponse } from '../types';
import { TaskStatus } from '../types';

export const taskService = {
  async getAll(page = 0, size = 20, sortBy = 'createdAt', sortDir: 'ASC' | 'DESC' = 'DESC'): Promise<PageResponse<Task>> {
    const response = await apiClient.get<PageResponse<Task>>('/tasks', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async create(task: TaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  },

  async update(id: number, task: TaskRequest): Promise<Task> {
    const response = await apiClient.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async search(
    params: {
      search?: string;
      status?: TaskStatus;
      priority?: number;
      area?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: 'ASC' | 'DESC';
    }
  ): Promise<PageResponse<Task>> {
    const response = await apiClient.get<PageResponse<Task>>('/tasks/search', {
      params,
    });
    return response.data;
  },

  async getByWeek(start: string, end: string): Promise<Task[]> {
    const response = await apiClient.get<Task[]>('/tasks/week', {
      params: { start, end },
    });
    return response.data;
  },
};

