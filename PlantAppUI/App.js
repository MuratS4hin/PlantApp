import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import useAppStore from "./store/UseAppStore";
import NotificationService from "./services/NotificationService";

export default function App() {
  const authUser = useAppStore((state) => state.authUser);
  const allPlants = useAppStore((state) => state.AllPlants);
  const notificationSettings = useAppStore((state) => state.notificationSettings);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listen for incoming notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (when user taps on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // You can navigate to specific plant detail here if needed
      // const plantId = response.notification.request.content.data.plantId;
    });

    return () => {
      notificationListener.current?.remove?.();
      responseListener.current?.remove?.();
    };
  }, []);

  useEffect(() => {
    // Initialize notifications when app starts
    const initializeNotifications = async () => {
      if (authUser && notificationSettings.notificationsEnabled) {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          await NotificationService.scheduleNotificationsForPlants(allPlants, notificationSettings);
        }
      }
    };

    initializeNotifications();
  }, [authUser, allPlants, notificationSettings]);

  return (
    <NavigationContainer>
      {authUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
