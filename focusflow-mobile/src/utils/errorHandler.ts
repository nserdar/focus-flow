// src/utils/errorHandler.ts
import { Alert } from 'react-native';

interface ErrorWithResponse extends Error {
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

export const handleApiError = (error: ErrorWithResponse) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.response) {
    switch (error.response.status) {
      case 400:
        errorMessage = error.response.data.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Session expired. Please log in again.';
        // Handle logout
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage = 'A server error occurred. Please try again later.';
        break;
    }
  } else if (error.message.includes('Network Error')) {
    errorMessage = 'Network error. Please check your internet connection.';
  }

  Alert.alert('Error', errorMessage);
  return errorMessage;
};