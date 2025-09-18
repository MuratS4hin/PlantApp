import React, { useState, useRef } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../utils/Styles';
import { COLORS } from '../utils/Constants';
import useAppStore from "../store/UseAppStore";

const TaskCard = ({ task, navigation }) => {
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const updatePlant = useAppStore((state) => state.updatePlant); // add updatePlant in your store

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
    // update lastWatered in the store
    updatePlant(task.id, { lastWatered: Date.now() });

    // close animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDone(false);
    });
  };

  return (
    <View style={{ position: "relative", marginBottom: 10 }}>
      {/* Approve & Cancel icons behind */}
      {done && (
        <View
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            flexDirection: "row",
            transform: [{ translateY: -12 }],
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

      {/* Foreground card */}
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
            <Text style={styles.taskDetailText}>
              Water in {task.wateringDayUnit - Math.ceil((task.lastWatered - Date.now()) / (1000 * 60 * 60 * 24))} Days
            </Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        {allPlants.map((task) => (
          <TaskCard key={task.id} task={task} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
