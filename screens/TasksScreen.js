import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../utils/Styles';
import { COLORS, allPlants } from '../utils/Constants';

const HomeScreen = ({ navigation }) => {
  const [checkedTasks, setCheckedTasks] = useState({}); // {id: true/false}

  const toggleCheck = (taskId) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        {allPlants.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            {/* Left side: image + info */}
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
              onPress={() => navigation.navigate("Detail", { plant: task })}
            >
              <Image source={{ uri: task.image }} style={styles.taskImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.taskPlantName}>{task.name}</Text>
                <Text style={styles.taskDetailText}>{task.task}</Text>
              </View>
            </TouchableOpacity>

            {/* Right side: checkbox */}
            <TouchableOpacity onPress={() => toggleCheck(task.id)}>
              <MaterialIcons
                name={checkedTasks[task.id] ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={checkedTasks[task.id] ? COLORS.primary : COLORS.gray200}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
