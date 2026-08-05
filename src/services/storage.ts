import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@utils/constants';
import { UserSettings } from '@types/index';

class StorageService {
  /**
   * Get item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set item in storage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get settings
   */
  async getSettings(): Promise<UserSettings | null> {
    return this.getItem(STORAGE_KEYS.SETTINGS);
  }

  /**
   * Save settings
   */
  async saveSettings(settings: UserSettings): Promise<void> {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * Check if onboarded
   */
  async isOnboarded(): Promise<boolean> {
    const value = await this.getItem<boolean>(STORAGE_KEYS.ONBOARDED);
    return value ?? false;
  }

  /**
   * Mark as onboarded
   */
  async markOnboarded(): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDED, true);
  }
}

export const storageService = new StorageService();
