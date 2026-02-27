import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Switch,
  StyleSheet,
  ScrollView,
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import NotificationService from '../services/NotificationService';

export default function SettingsScreen() {
  const notificationSettings = useAppStore((state) => state.notificationSettings);
  const updateNotificationSettings = useAppStore((state) => state.updateNotificationSettings);
  const allPlants = useAppStore((state) => state.AllPlants);

  const [isEnabled, setIsEnabled] = useState(notificationSettings.notificationsEnabled);
  const [wateringEnabled, setWateringEnabled] = useState(notificationSettings.wateringNotifications);
  const [fertilizingEnabled, setFertilizingEnabled] = useState(notificationSettings.fertilizingNotifications);

  useEffect(() => {
    setIsEnabled(notificationSettings.notificationsEnabled);
    setWateringEnabled(notificationSettings.wateringNotifications);
    setFertilizingEnabled(notificationSettings.fertilizingNotifications);
  }, [notificationSettings]);

  const handleToggleNotifications = async (value) => {
    if (value) {
      // Request permissions when enabling notifications
      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive plant care reminders.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    setIsEnabled(value);
    const newSettings = {
      notificationsEnabled: value,
      wateringNotifications: value ? wateringEnabled : false,
      fertilizingNotifications: value ? fertilizingEnabled : false,
    };
    updateNotificationSettings(newSettings);

    if (value) {
      // Schedule notifications for all plants
      await NotificationService.scheduleNotificationsForPlants(allPlants, newSettings);
      Alert.alert("Success", "Notifications have been enabled and scheduled.");
    } else {
      // Cancel all notifications
      await NotificationService.cancelAllNotifications();
      Alert.alert("Success", "All notifications have been disabled.");
    }
  };

  const handleToggleWatering = async (value) => {
    setWateringEnabled(value);
    const newSettings = {
      ...notificationSettings,
      wateringNotifications: value,
    };
    updateNotificationSettings(newSettings);

    if (isEnabled) {
      await NotificationService.scheduleNotificationsForPlants(allPlants, newSettings);
    }
  };

  const handleToggleFertilizing = async (value) => {
    setFertilizingEnabled(value);
    const newSettings = {
      ...notificationSettings,
      fertilizingNotifications: value,
    };
    updateNotificationSettings(newSettings);

    if (isEnabled) {
      await NotificationService.scheduleNotificationsForPlants(allPlants, newSettings);
    }
  };

  const handleViewScheduledNotifications = async () => {
    const notifications = await NotificationService.getAllScheduledNotifications();
    if (notifications.length === 0) {
      Alert.alert("No Notifications", "There are no scheduled notifications at the moment.");
    } else {
      const notificationList = notifications.map((n, index) => 
        `${index + 1}. ${n.content.title} - ${n.content.body}`
      ).join('\n\n');
      Alert.alert(
        `Scheduled Notifications (${notifications.length})`,
        notificationList,
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>Receive reminders for plant care</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: COLORS.gray200, true: COLORS.primary + '80' }}
              thumbColor={isEnabled ? COLORS.primary : COLORS.gray400}
              ios_backgroundColor={COLORS.gray200}
              onValueChange={handleToggleNotifications}
              value={isEnabled}
            />
          </View>

          <View style={[styles.settingRow, !isEnabled && styles.disabledRow]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="opacity" size={24} color={isEnabled ? "#4A90E2" : COLORS.gray400} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, !isEnabled && styles.disabledText]}>
                  Watering Reminders
                </Text>
                <Text style={[styles.settingDescription, !isEnabled && styles.disabledText]}>
                  Get notified when plants need water
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: COLORS.gray200, true: '#4A90E2' + '80' }}
              thumbColor={wateringEnabled ? "#4A90E2" : COLORS.gray400}
              ios_backgroundColor={COLORS.gray200}
              onValueChange={handleToggleWatering}
              value={wateringEnabled}
              disabled={!isEnabled}
            />
          </View>

          <View style={[styles.settingRow, !isEnabled && styles.disabledRow]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="eco" size={24} color={isEnabled ? "#A66A2D" : COLORS.gray400} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, !isEnabled && styles.disabledText]}>
                  Fertilizing Reminders
                </Text>
                <Text style={[styles.settingDescription, !isEnabled && styles.disabledText]}>
                  Get notified when plants need fertilizer
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: COLORS.gray200, true: '#A66A2D' + '80' }}
              thumbColor={fertilizingEnabled ? "#A66A2D" : COLORS.gray400}
              ios_backgroundColor={COLORS.gray200}
              onValueChange={handleToggleFertilizing}
              value={fertilizingEnabled}
              disabled={!isEnabled}
            />
          </View>
        </View>

        {/* Notification Actions */}
        {isEnabled && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewScheduledNotifications}
            >
              <MaterialIcons name="schedule" size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>View Scheduled Notifications</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <MaterialIcons name="info-outline" size={20} color={COLORS.gray500} />
          <Text style={styles.infoText}>
            Notifications are scheduled based on your plant care schedules. 
            You will be reminded on the day each task is due.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary || '#000',
    marginBottom: 24,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary || '#000',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  disabledRow: {
    opacity: 0.5,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary || '#000',
  },
  settingDescription: {
    fontSize: 13,
    color: COLORS.textSecondary || '#666',
    marginTop: 2,
  },
  disabledText: {
    color: COLORS.gray400,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '10',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.gray50 || '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray600 || '#666',
    marginLeft: 8,
    lineHeight: 18,
  },
});
