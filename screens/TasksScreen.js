import React, { useState, useRef } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, Animated, StyleSheet, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import useAppStore from "../store/UseAppStore";

const TaskCard = ({ task, navigation }) => {
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const updateTask = useAppStore((state) => state.updateTask);

  const handleDone = () => {
    setDone(true);
    Animated.timing(slideAnim, {
      toValue: -80,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDone(false);
    });
  };

  const handleApprove = () => {
    updateTask(task.id, { lastWatered: Date.now() });
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDone(false);
    });
  };

  const daysLeft = Math.max(
    0,
    task.dayUnit - Math.ceil((Date.now() - task.lastDate) / (1000 * 60 * 60 * 24))
  );

  return (
    <View style={{ position: "relative", marginBottom: 10, marginHorizontal: 10 }}>
      {done && (
        <View
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            flexDirection: "row",
            transform: [{ translateY: -14 }],
          }}
        >
          <TouchableOpacity onPress={handleApprove} style={{ marginHorizontal: 5 }}>
            <MaterialIcons name="check-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={{ marginHorizontal: 5 }}>
            <MaterialIcons name="cancel" size={28} color={COLORS.error || "red"} />
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        style={[
          styles.taskCard,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          onPress={() => navigation.navigate("Detail", { plant: task })}
        >
          <Image source={{ uri: task.plantImage }} style={styles.taskImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.taskPlantName}>{task.plantName}</Text>
            <Text style={styles.taskDetailText}>{task.type} in {daysLeft} Days</Text>
          </View>
        </TouchableOpacity>

        {!done && (
          <TouchableOpacity
            onPress={handleDone}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: COLORS.primary,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Done</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const allPlants = useAppStore((state) => state.AllPlants);

  const tasks = allPlants.flatMap((plant) => [
    {
      id: plant.id + "_water",         // unique ID for watering task
      plantName: plant.plantName,
      plantImage: plant.plantImage,
      type: "Water",
      lastDate: plant.lastWatered,
      dayUnit: plant.wateringDayUnit,
    },
    {
      id: plant.id + "_fertilize",     // unique ID for fertilizing task
      plantName: plant.plantName,
      plantImage: plant.plantImage,
      type: "Fertilize",
      lastDate: plant.lastFertilized,
      dayUnit: plant.fertilizingDayUnit,
    },
  ]);

  // Sort tasks by days left until next care
  const orderedTasks = tasks.sort((a, b) => {
    const aDaysLeft = a.dayUnit - Math.ceil((Date.now() - a.lastDate) / (1000 * 60 * 60 * 24));
    const bDaysLeft = b.dayUnit - Math.ceil((Date.now() - b.lastDate) / (1000 * 60 * 60 * 24));
    return aDaysLeft - bDaysLeft;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        {orderedTasks.length === 0 ? (
          <ImageBackground
            source={require('../assets/background.png')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.6 }}
            resizeMode="cover"
          >
            <View style={styles.emptyStateContainer}>
              <View style={styles.overlay}>
                <Text style={styles.title}>Welcome to Plant Care</Text>
                <Text style={styles.subtitle}>
                  Your personal guide to thriving indoor plants.
                </Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <View>
            <View style={styles.taskTitle}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            </View>
            {orderedTasks.map((task) => (
              <TaskCard key={task.id} task={task} navigation={navigation} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default HomeScreen;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  screenContainer: { padding: 10, flexGrow: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 16, marginLeft: 10 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200
  },
  taskImage: { width: 64, height: 64, borderRadius: 8, marginRight: 16 },
  taskPlantName: { fontSize: 16, fontWeight: "500" },
  taskDetailText: { fontSize: 16, color: COLORS.textSecondary },
  backgroundImage: { flex: 1 },
  overlay: { backgroundColor: "rgba(255, 255, 255, 0.72)", padding: 20, borderRadius: 1, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: "center" },
  taskTitle: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 12 },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

});
