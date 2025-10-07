import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';

const TaskCard = ({ task, navigation }) => {
  const [done, setDone] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const updateTask = useAppStore((state) => state.updateTask);

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
    updateTask(task.id, { lastWatered: Date.now() });
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDone(false));
  };

  const daysLeft = Math.max(
    0,
    task.dayUnit - Math.ceil((Date.now() - task.lastDate) / (1000 * 60 * 60 * 24))
  );

  // 🌿 Type color (blue for water, brown for fertilizing)
  const typeColor =
    task.type.toLowerCase() === 'water'
      ? '#4A90E2'
      : task.type.toLowerCase() === 'fertilize'
      ? '#A66A2D'
      : COLORS.primary;

  return (
    <View style={{ position: 'relative', marginBottom: 6, marginHorizontal: 12 }}>
      {done && (
        <View
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            flexDirection: 'row',
            transform: [{ translateY: -14 }],
            zIndex: 2,
          }}
        >
          <TouchableOpacity onPress={handleApprove} style={{ marginHorizontal: 5 }}>
            <MaterialIcons name="check-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={{ marginHorizontal: 5 }}>
            <MaterialIcons name="cancel" size={28} color={COLORS.error || 'red'} />
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
          onPress={() => navigation.navigate('Detail', { plantId: task.plantId })}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: task.plantImage }} style={styles.taskImage} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.taskPlantName}>{task.plantName}</Text>
            <Text style={[styles.taskDetailText, { color: typeColor }]}>
              {task.type} in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
            </Text>
          </View>
        </TouchableOpacity>

        {!done && (
          <TouchableOpacity onPress={handleDone} style={[styles.doneButton, { backgroundColor: typeColor }]}>
            <Text style={styles.doneButtonText}>Done</Text>
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
      id: plant.id + '_water',
      plantId: plant.id,
      plantName: plant.plantName,
      plantImage: plant.plantImage,
      type: 'Water',
      lastDate: plant.lastWatered,
      dayUnit: plant.wateringDayUnit,
    },
    {
      id: plant.id + '_fertilize',
      plantId: plant.id,
      plantName: plant.plantName,
      plantImage: plant.plantImage,
      type: 'Fertilize',
      lastDate: plant.lastFertilized,
      dayUnit: plant.fertilizingDayUnit,
    },
  ]);

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#F8F9FA' },
  screenContainer: { paddingVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, marginLeft: 16 },
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
  backgroundImage: { flex: 1 },
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
  },
});
