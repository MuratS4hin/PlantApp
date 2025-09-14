import React from 'react';
import { styles } from '../utils/Styles';
import { COLORS } from '../utils/Constants';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Bottom Nav ---
const BottomNavigation = ({ activeScreen, onNavigate }) => (
  <View style={styles.navBar}>
    <TouchableOpacity onPress={() => onNavigate("Home")} style={styles.navItem}>
      <MaterialIcons name="eco" size={24} color={activeScreen === "Home" ? COLORS.primary : COLORS.textSecondary} />
      <Text style={[styles.navText, { color: activeScreen === "Home" ? COLORS.primary : COLORS.textSecondary }]}>
        My Plants
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate("AddPlant")} style={styles.navItem}>
      <MaterialIcons name="add-circle" size={24} color={activeScreen === "AddPlant" ? COLORS.primary : COLORS.textSecondary} />
      <Text style={[styles.navText, { color: activeScreen === "AddPlant" ? COLORS.primary : COLORS.textSecondary }]}>
        Add Plant
      </Text>
    </TouchableOpacity>
  </View>
);

export default BottomNavigation;
