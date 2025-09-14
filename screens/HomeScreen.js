import React from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../utils/Styles';
import { COLORS, upcomingTasks, allPlants } from '../utils/Constants';

// ✅ Receive `navigation` from React Navigation
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Plants</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPlant")} // ✅ navigation comes from stack
        >
          <MaterialIcons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        {upcomingTasks.map(task => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            onPress={() => navigation.navigate("Detail", { task })}
          >
            <Image source={{ uri: task.image }} style={styles.taskImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.taskPlantName}>{task.plantName}</Text>
              <Text style={styles.taskDetail}>{task.task}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.gray200} />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>All My Plants</Text>
        <View style={styles.plantGrid}>
          {allPlants.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.plantCard}
              onPress={() => navigation.navigate("Detail", { plant: item })}
            >
              <Image source={{ uri: item.image }} style={styles.plantImage} />
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantStatus}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
