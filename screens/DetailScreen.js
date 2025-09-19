import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/Constants';
import { careHistory } from '../utils/Constants';
import useAppStore from '../store/UseAppStore';
import { Alert } from 'react-native';

const DetailScreen = ({ navigation, route }) => {
  const { plant } = route.params;
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
      {/* Buttons */}
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("AddPlant", { plant: plant })}>
          <MaterialIcons name="edit" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Plant Image */}
        <View style={{ padding: 16 }}>
          <Image source={{ uri: plant.plantImage }} style={styles.detailImage} resizeMode="cover" />
        </View>

        {/* Care Schedule */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.sectionTitle}>Care Schedule</Text>
          <View style={styles.careGrid}>
            <View style={styles.careItem}>
              <MaterialIcons name="water-drop" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Watering</Text>
              <Text style={styles.careItemSubtitle}>Every {plant.wateringNumber} {plant.wateringUnit}</Text>
            </View>
            <View style={styles.careItem}>
              <MaterialIcons name="wb-sunny" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Sunlight</Text>
              <Text style={styles.careItemSubtitle}>{plant.sunlight}</Text>
            </View>
            <View style={styles.careItem}>
              <MaterialIcons name="science" size={30} color={COLORS.green700} />
              <Text style={styles.careItemTitle}>Fertilizing</Text>
              <Text style={styles.careItemSubtitle}>Every {plant.fertilizingNumber} {plant.fertilizingUnit}</Text>
            </View>
          </View>
        </View>

        {/* Care History */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={styles.sectionTitle}>Care History</Text>
          <View style={{ marginTop: 8 }}>
            {careHistory.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.historyItem,
                  { borderBottomWidth: index === careHistory.length - 1 ? 0 : 1, borderBottomColor: COLORS.gray200 },
                ]}
              >
                <View style={styles.historyIconContainer}>
                  <MaterialIcons
                    name={
                      item.icon === 'water-drop'
                        ? 'water-drop'
                        : item.icon === 'science'
                        ? 'science'
                        : 'local-florist'
                    }
                    size={24}
                    color={COLORS.green600}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyItemTitle}>{item.type}</Text>
                  <Text style={styles.historyItemSubtitle}>{item.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Add Button 
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity style={styles.addCareButton} onPress={() => console.log('Add Care Activity')}>
          <MaterialIcons name="add-circle" size={20} color={COLORS.white} />
          <Text style={styles.addCareButtonText}>Add Care Activity</Text>
        </TouchableOpacity>
      </View>*/}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  detailHeader: {flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',paddingTop: 12,paddingRight:10,backgroundColor: COLORS.white},
  detailHeaderTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  headerButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  detailImage: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  careGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  careItem: { backgroundColor: COLORS.green50, borderRadius: 12, padding: 12, alignItems: 'center', flex: 1, marginHorizontal: 4 },
  careItemTitle: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary, marginTop: 4 },
  careItemSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  historyIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.green50, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyItemTitle: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  historyItemSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  stickyButtonContainer: { padding: 16, backgroundColor: COLORS.white },
  addCareButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, gap: 8 },
  addCareButtonText: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginLeft: 8 },
});

export default DetailScreen;
