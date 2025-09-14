import React from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../utils/Styles';
import { COLORS, allPlants } from '../utils/Constants';

const MyPlantsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>My Plants</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddPlant")}
          >
            <MaterialIcons name="add" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Plant Grid */}
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

export default MyPlantsScreen;
