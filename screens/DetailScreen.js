import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import { careHistory } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import { formatDate } from '../utils/Helpers';

const DetailScreen = ({ navigation, route }) => {
  const { plantId } = route.params;
  const plant = useAppStore((state) => state.getPlant(plantId));
  console.log("DetailScreen - plant:", plantId, plant);
  const deletePlant = useAppStore((state) => state.deletePlant);

  const handleDelete = () => {
    Alert.alert(
      "Delete Plant",
      "Are you sure you want to delete this plant?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePlant(plant.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>{plant.plantName}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate("AddPlant", { plant })}
        >
          <MaterialIcons name="edit" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Plant Image */}
        <View style={{ padding: 16 }}>
          <Image
            source={{ uri: plant.plantImage }}
            style={styles.detailImage}
            resizeMode="cover"
          />
        </View>

        {/* Care Schedule */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.sectionTitle}>Care Schedule</Text>
          <View style={styles.careGrid}>
            <View style={styles.careItem}>
              <MaterialIcons name="water-drop" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Watering</Text>
              <Text style={styles.careItemSubtitle}>
                Every {plant.wateringNumber} {plant.wateringUnit}
              </Text>
            </View>
            <View style={styles.careItem}>
              <MaterialIcons name="wb-sunny" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Sunlight</Text>
              <Text style={styles.careItemSubtitle}>{plant.sunlight}</Text>
            </View>
            <View style={styles.careItem}>
              <MaterialIcons name="science" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Fertilizing</Text>
              <Text style={styles.careItemSubtitle}>
                Every {plant.fertilizingNumber} {plant.fertilizingUnit}
              </Text>
            </View>
          </View>
        </View>

        {/* Care History */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Care History</Text>
          <View style={styles.historyItem}>
            <View style={styles.historyIconContainer}>
              <MaterialIcons
                name={'water-drop'}
                size={24}
                color={COLORS.green600}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyItemTitle}>{formatDate(plant.lastWatered)}</Text>
              <Text style={styles.historyItemSubtitle}>Last Watered Date</Text>
            </View>
          </View>
          <View style={styles.historyItem}>
            <View style={styles.historyIconContainer}>
              <MaterialIcons
                name={'science'}
                size={24}
                color={COLORS.green600}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyItemTitle}>{formatDate(plant.lastFertilized)}</Text>
              <Text style={styles.historyItemSubtitle}>Last Fertilized Date</Text>
            </View>
          </View>
          <View style={styles.historyItem}>
            <View style={styles.historyIconContainer}>
              <MaterialIcons
                name={'edit-note'}
                size={24}
                color={COLORS.green600}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyItemTitle}>{plant.careNotes}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // buttons at edges, title centered
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },

  careGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  careItem: {
    backgroundColor: COLORS.green50,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  careItemTitle: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary, marginTop: 4 },
  careItemSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  historyItemTitle: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  historyItemSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});

export default DetailScreen;
