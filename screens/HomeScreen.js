import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { styles } from '../utils/Styles';
import BottomNavigation from '../components/BottomNavigation';
import TasksScreen from './TasksScreen';
import MyPlantsScreen from './MyPlantsScreen';

const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Tasks'); // default tab

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {selectedTab === 'Tasks' ? <TasksScreen navigation={navigation} /> : <MyPlantsScreen navigation={navigation} />}
      </View>
      <BottomNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </SafeAreaView>
  );
};

export default HomeScreen;
