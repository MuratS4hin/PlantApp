import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import useAppStore from "./store/UseAppStore";

export default function App() {
  const authUser = useAppStore((state) => state.authUser);

  return (
    <NavigationContainer>
      {authUser ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
