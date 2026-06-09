// src/config/api.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError } from '../utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'YOUR_API_BASE_URL'; // Should be in environment variables

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { 
          refreshToken 
        });
        
        const { accessToken } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, log the user out
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId', 'email']);
        // You might want to redirect to login here
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (
  request: () => Promise<AxiosResponse>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (retries <= 0) {
      throw error;
    }

    // Only retry on network errors or 5xx errors
    if (error.message.includes('Network Error') || 
        (error.response && error.response.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(request, retries - 1, delay * 2); // Exponential backoff
    }

    throw error;
  }
};

// Enhanced API methods with retry logic
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    retryRequest(() => apiClient.get<T>(url, config)),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    retryRequest(() => apiClient.post<T>(url, data, config)),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    retryRequest(() => apiClient.put<T>(url, data, config)),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    retryRequest(() => apiClient.delete<T>(url, config)),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    retryRequest(() => apiClient.patch<T>(url, data, config)),
};

export default api;