import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../utils/Styles';
import { COLORS } from '../utils/Constants';

const BottomNavigation = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => setSelectedTab('Tasks')} style={styles.navItem}>
        <MaterialIcons
          name="task-alt"
          size={24}
          color={selectedTab === 'Tasks' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.navText, { color: selectedTab === 'Tasks' ? COLORS.primary : COLORS.textSecondary }]}>
          Tasks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedTab('MyPlants')} style={styles.navItem}>
        <MaterialIcons
          name="eco"
          size={24}
          color={selectedTab === 'MyPlants' ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.navText, { color: selectedTab === 'MyPlants' ? COLORS.primary : COLORS.textSecondary }]}>
          My Plants
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;
