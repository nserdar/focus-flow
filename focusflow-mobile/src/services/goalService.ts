import apiClient from '../config/api';
import { Goal, GoalRequest, PageResponse } from '../types';
import { GoalStatus } from '../types';

export const goalService = {
  async getAll(page = 0, size = 20, sortBy = 'createdAt', sortDir: 'ASC' | 'DESC' = 'DESC'): Promise<PageResponse<Goal>> {
    const response = await apiClient.get<PageResponse<Goal>>('/goals', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  async getById(id: number): Promise<Goal> {
    const response = await apiClient.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  async create(goal: GoalRequest): Promise<Goal> {
    const response = await apiClient.post<Goal>('/goals', goal);
    return response.data;
  },

  async update(id: number, goal: GoalRequest): Promise<Goal> {
    const response = await apiClient.put<Goal>(`/goals/${id}`, goal);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  },

  async search(
    params: {
      search?: string;
      status?: GoalStatus;
      priority?: number;
      area?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      size?: number;
      sortBy?: string;
      sortDir?: 'ASC' | 'DESC';
    }
  ): Promise<PageResponse<Goal>> {
    const response = await apiClient.get<PageResponse<Goal>>('/goals/search', {
      params,
    });
    return response.data;
  },

  async getByArea(area: string): Promise<Goal[]> {
    const response = await apiClient.get<Goal[]>(`/goals/area/${area}`);
    return response.data;
  },
};

