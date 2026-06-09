import { api } from '../api';
import { AuthRequest, RegisterRequest, JwtResponse } from '@/types';

export const authService = {
  login: async (credentials: AuthRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/register', data);
    return response.data;
  },

  refresh: async (token: string): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/auth/refresh', null, {
      params: { token },
    });
    return response.data;
  },
};

