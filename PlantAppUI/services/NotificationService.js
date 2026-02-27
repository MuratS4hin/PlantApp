import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  createTimeIntervalTrigger(daysUntilDue) {
    const seconds = Math.max(Math.round(daysUntilDue * 24 * 60 * 60), 60);

    return {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    };
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('plant-care', {
          name: 'Plant Care Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4CAF50',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Schedule a notification for watering
  async scheduleWateringNotification(plant, daysUntilDue) {
    try {
      const trigger = this.createTimeIntervalTrigger(daysUntilDue);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Time to Water!',
          body: `${plant.plantName} needs watering today.`,
          data: { plantId: plant.id, type: 'watering' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' && { channelId: 'plant-care' }),
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling watering notification:', error);
      return null;
    }
  }

  // Schedule a notification for fertilizing
  async scheduleFertilizingNotification(plant, daysUntilDue) {
    try {
      const trigger = this.createTimeIntervalTrigger(daysUntilDue);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌱 Time to Fertilize!',
          body: `${plant.plantName} needs fertilizing today.`,
          data: { plantId: plant.id, type: 'fertilizing' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' && { channelId: 'plant-care' }),
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling fertilizing notification:', error);
      return null;
    }
  }

  // Schedule notifications for all plants
  async scheduleNotificationsForPlants(plants, settings) {
    if (!settings.notificationsEnabled) {
      return;
    }

    // Cancel all existing notifications first
    await this.cancelAllNotifications();

    const isSummer = this.isSummerSeason();

    for (const plant of plants) {
      // Schedule watering notification
      if (settings.wateringNotifications && (plant.summerWateringDayUnit > 0 || plant.winterWateringDayUnit > 0)) {
        const wateringInterval = isSummer ? plant.summerWateringDayUnit : plant.winterWateringDayUnit;
        const nextWatering = plant.lastWatered + (wateringInterval * 24 * 60 * 60 * 1000);
        const daysUntilWatering = Math.ceil((nextWatering - Date.now()) / (24 * 60 * 60 * 1000));

        if (daysUntilWatering > 0) {
          await this.scheduleWateringNotification(plant, daysUntilWatering);
        }
      }

      // Schedule fertilizing notification
      if (settings.fertilizingNotifications && plant.fertilizingDayUnit > 0) {
        const nextFertilizing = plant.lastFertilized + (plant.fertilizingDayUnit * 24 * 60 * 60 * 1000);
        const daysUntilFertilizing = Math.ceil((nextFertilizing - Date.now()) / (24 * 60 * 60 * 1000));

        if (daysUntilFertilizing > 0) {
          await this.scheduleFertilizingNotification(plant, daysUntilFertilizing);
        }
      }
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  // Cancel specific notification
  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  // Get all scheduled notifications
  async getAllScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  // Check if it's summer season (simplified logic)
  isSummerSeason() {
    const month = new Date().getMonth();
    return month >= 3 && month <= 8; // April to September
  }
}

export default new NotificationService();
