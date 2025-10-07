import React from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';


const MyPlantsScreen = ({ navigation }) => {
  const allPlants = useAppStore((state) => state.AllPlants);

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
              onPress={() => navigation.navigate("Detail", { plantId: item.id })}
            >
              <Image source={{ uri: item.plantImage }} style={styles.plantImage} />
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{item.plantName}</Text>
                {/*<Text style={styles.plantStatus}>{item.plantStatus}</Text>*/}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPlantsScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  screenContainer: { padding: 16 },
  headerRow: {flexDirection: "row",justifyContent: "flex-start",alignItems: "center",marginBottom: 12,},
  addButton: {backgroundColor: COLORS.primary,borderRadius: 20,padding: 0, marginLeft: 12,},
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 16 },
  plantGrid: { flexDirection: "row" , justifyContent: "space-between"},
  plantCard: { width: "48%", backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray200, marginBottom: 16 },
  plantImage: { width: "100%", height: 128, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  plantInfo: { padding: 8 },
  plantName: { fontWeight: "600", fontSize: 15 },
  plantStatus: { fontSize: 13, color: COLORS.textSecondary }
});