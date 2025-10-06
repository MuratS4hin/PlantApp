import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, ImageBackground } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import TasksScreen from './TasksScreen';
import MyPlantsScreen from './MyPlantsScreen';
import { COLORS } from '../utils/Constants';

const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Tasks'); // default tab

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image applied to whole screen */}
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.6 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }}>
          {selectedTab === 'Tasks' ? (
            <TasksScreen navigation={navigation} />
          ) : (
            <MyPlantsScreen navigation={navigation} />
          )}
        </View>
      </ImageBackground>

      {/* Bottom Navigation stays above background */}
      <BottomNavigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  backgroundImage: { flex: 1 },
});
