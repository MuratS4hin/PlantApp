import React, { useState, useRef, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import { isSummerSeason } from "../utils/Helpers";

const TABS = {
  UPCOMING: 'Upcoming',
  WATERING: 'Watering',
  FERTILIZING: 'Fertilizing',
};

const useTaskLogic = () => {
  const allPlants = useAppStore((state) => state.AllPlants);
  const [activeTab, setActiveTab] = useState(TABS.UPCOMING);
  const hasPlants = allPlants.length > 0;

  const allTasks = useMemo(() => {
    const isSummer = isSummerSeason();
    return allPlants.flatMap((plant) => {
      if (!plant.id) return [];

      return [
        {
          id: plant.id + "_water",
          plantId: plant.id,
          plantName: plant.plantName,
          plantImage: plant.plantImage,
          type: "Water",
          lastDate: plant.lastWatered,
          isSummer,
          summerDayUnit: plant.summerWateringDayUnit,
          winterDayUnit: plant.winterWateringDayUnit,
        },
        {
          id: plant.id + "_fertilize",
          plantId: plant.id,
          plantName: plant.plantName,
          plantImage: plant.plantImage,
          type: "Fertilize",
          lastDate: plant.lastFertilized,
          dayUnit: plant.fertilizingDayUnit,
        },
      ]
        .filter(task => task.type === "Fertilize" ? task.dayUnit > 0 :
          (task.summerDayUnit > 0 || task.winterDayUnit > 0));
    });
  }, [allPlants]);

  const calculateDaysLeft = (task) => {
    if (task.type === "Water") {
      const interval = task.isSummer ? task.summerDayUnit : task.winterDayUnit;
      return Math.ceil((task.lastDate + interval * 86400000 - Date.now()) / 86400000);
    }

    // Fertilizer
    return Math.ceil((task.lastDate + task.dayUnit * 86400000 - Date.now()) / 86400000);
  };

  const filteredTasks = useMemo(() => {
    let tasks = allTasks;

    if (activeTab === TABS.UPCOMING) {
      tasks = allTasks.filter((task) => calculateDaysLeft(task) <= 7);
    } else if (activeTab === TABS.WATERING) {
      tasks = allTasks.filter((task) => task.type === "Water");
    } else if (activeTab === TABS.FERTILIZING) {
      tasks = allTasks.filter((task) => task.type === "Fertilize");
    }

    return tasks.sort((a, b) => calculateDaysLeft(a) - calculateDaysLeft(b));
  }, [allTasks, activeTab]);

  return { activeTab, setActiveTab, filteredTasks, hasPlants, calculateDaysLeft };
};


const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isActive && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const TaskCard = ({ task, navigation, calculateDaysLeft }) => {
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const updatePlant = useAppStore((state) => state.updatePlant);
  const getPlant = useAppStore.getState().getPlant;

  const handleDone = () => {
    setDone(true);
    Animated.timing(slideAnim, {
      toValue: -80,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDone(false));
  };

  const handleApprove = () => {
    const updateKey =
      task.type.toLowerCase() === "water"
        ? "lastWatered"
        : "lastFertilized";

    const selectedPlant = getPlant(task.plantId);
    if (!selectedPlant) return;

    updatePlant({
      ...selectedPlant,
      [updateKey]: Date.now(),
    });

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDone(false));
  };

  const daysLeft = calculateDaysLeft(task);

  const typeColor =
    task.type.toLowerCase() === "water"
      ? "#4A90E2"
      : task.type.toLowerCase() === "fertilize"
        ? "#A66A2D"
        : COLORS.primary;

  return (
    <View style={{ position: "relative", marginBottom: 6, marginHorizontal: 12 }}>
      {done && (
        <View
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            flexDirection: "row",
            transform: [{ translateY: -14 }],
            zIndex: 2,
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
            borderLeftColor: typeColor,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.taskContent}
          onPress={() => navigation.navigate("Detail", { plantId: task.plantId })}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: task.plantImage }} style={styles.taskImage} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.taskPlantName}>{task.plantName}</Text>
            <Text style={[styles.taskDetailText, { color: typeColor }]}>
              {task.type} in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </Text>
          </View>
        </TouchableOpacity>

        {!done && (
          <TouchableOpacity
            onPress={handleDone}
            style={[styles.doneButton, { backgroundColor: typeColor }]}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};



const TasksScreen = ({ navigation }) => {
  const { activeTab, setActiveTab, filteredTasks, hasPlants, calculateDaysLeft } = useTaskLogic(); // ✅ added calculateDaysLeft

  const EmptyState = () => (
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
  );

  const NoTasksForTab = () => (
    <View style={styles.noTasksContainer}>
      <MaterialIcons name="check" size={40} color={COLORS.gray400} />
      <Text style={styles.noTasksText}>
        No {activeTab.toLowerCase()} tasks right now!
      </Text>
      <Text style={styles.noTasksSubtext}>
        {activeTab === TABS.UPCOMING
          ? 'All tasks are more than 7 days away.'
          : 'You don\'t have any plants with a set schedule for this task type.'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        {!hasPlants ? (
          <EmptyState />
        ) : (
          <View>
            <View style={styles.tabBar}>
              {Object.values(TABS).map((tabName) => (
                <TabButton
                  key={tabName}
                  title={tabName}
                  isActive={activeTab === tabName}
                  onPress={() => setActiveTab(tabName)}
                />
              ))}
            </View>

            <View style={styles.taskTitle}>
              <Text style={styles.sectionTitle}>{activeTab} Tasks</Text>
            </View>

            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  navigation={navigation}
                  calculateDaysLeft={calculateDaysLeft} // ✅ artık çalışacak
                />
              ))
            ) : (
              <NoTasksForTab />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


export default TasksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#F8F9FA' },
  screenContainer: { paddingVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, marginLeft: 16 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 0,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    paddingVertical: 4,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary || '#5CB85C',
  },
  tabButtonText: {
    color: COLORS.textPrimary || '#222',
    fontWeight: '600',
    fontSize: 15,
  },
  tabButtonTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 5,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
  },
  taskImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  taskPlantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary || '#222',
  },
  taskDetailText: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  doneButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  backgroundImage: { flex: 1, height: Dimensions.get('window').height - 100 },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center' },
  taskTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: Dimensions.get('window').height - 100,
  },
  noTasksContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: 16,
    marginTop: 30,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  noTasksText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: COLORS.gray700,
  },
  noTasksSubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.gray500,
  },
});