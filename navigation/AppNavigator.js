import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawerComponent from '../components/CustomDrawerComponent';
import DetailScreen from '../screens/DetailScreen';
import MyPlantsScreen from '../screens/MyPlantsScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Reusable Header Icon
function HeaderIcon({ onPress, iconName }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 8, // keeps tap target big
        marginLeft: -12,   // move left icon closer
        marginRight: -12, // move right icon closer
      }}
    >
      <Ionicons name={iconName} size={26} color="black" />
    </TouchableOpacity>
  );
}

// ✅ Stack Navigator
function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'PlantCare',
          // headerLeft: () => (
          //   <HeaderIcon
          //     onPress={() => navigation.openDrawer()}
          //     iconName="menu-outline"
          //   />
          // ),
          // headerRight: () => (
          //   <HeaderIcon
          //     onPress={() => navigation.navigate('ProfileScreen')}
          //     iconName="person-circle-outline"
          //   />
          // ),
        })}
      />

      <Stack.Screen
        name="AddPlant"
        component={AddPlantScreen}
        options={{ title: 'Add Plant' }}
      />

      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Plants Detail' }}
      />

      <Stack.Screen
        name="MyPlants"
        component={MyPlantsScreen}
        options={{ title: 'My Plants' }}
      />
    </Stack.Navigator>
  );
}

// ✅ Drawer Navigator
export default function AppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerComponent {...props} />}
    >
      <Drawer.Screen name="Main" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}