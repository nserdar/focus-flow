// src/services/authService.ts
import { api } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { handleApiError } from '../utils/errorHandler';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const USER_ID_KEY = '@user_id';
const USER_EMAIL_KEY = '@user_email';

const storeAuthData = async (data: {
  accessToken: string;
  refreshToken: string;
  userId: string | number;
  email: string;
}) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, data.accessToken],
      [REFRESH_TOKEN_KEY, data.refreshToken],
      [USER_ID_KEY, data.userId.toString()],
      [USER_EMAIL_KEY, data.email],
    ]);
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      await storeAuthData(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      await storeAuthData(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove([
        TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_ID_KEY,
        USER_EMAIL_KEY,
      ]);
    }
  },

  async getStoredToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    if (!token) return false;
    
    // You might want to add token expiration check here
    // For example, decode the JWT and check the exp claim
    
    return true;
  },
};