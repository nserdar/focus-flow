import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

class NotificationService {
  private notificationListener: any;
  private responseListener: any;

  /**
   * Initialize notifications
   */
  async init(): Promise<void> {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Set up listeners
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse
    );

    // Request permissions
    await this.requestPermissions();
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<void> {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00ff88',
      });

      await Notifications.setNotificationChannelAsync('focus', {
        name: 'Focus Sessions',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00ff88',
      });

      await Notifications.setNotificationChannelAsync('break', {
        name: 'Break Time',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200],
        lightColor: '#00ccff',
      });
    }
  }

  /**
   * Schedule focus session notification
   */
  async scheduleFocusNotification(
    minutes: number,
    title: string = 'Focus Session Complete!',
    body: string = 'Time for a break!'
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
          data: { type: 'focus_complete' },
        },
        trigger: {
          seconds: minutes * 60,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule focus notification:', error);
      throw error;
    }
  }

  /**
   * Schedule break notification
   */
  async scheduleBreakNotification(
    minutes: number,
    title: string = 'Break Over!',
    body: string = 'Ready to focus again?'
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
          data: { type: 'break_complete' },
        },
        trigger: {
          seconds: minutes * 60,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule break notification:', error);
      throw error;
    }
  }

  /**
   * Send immediate notification
   */
  async sendNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
          data,
        },
        trigger: null,
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Cancel notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<any[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Handle notification received
   */
  private handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log('Notification received:', notification);
  };

  /**
   * Handle notification response
   */
  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    console.log('Notification response:', response);
  };

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export const notificationService = new NotificationService();
