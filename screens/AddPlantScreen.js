import React, { useState } from "react";
import { COLORS } from "../utils/Constants";

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const AddPlantScreen = ({ navigation }) => {
  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [careNotes, setCareNotes] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Form Content */}
      <ScrollView contentContainerStyle={styles.screenContainer}>
        {/* Photo Upload */}
        <TouchableOpacity style={styles.addPhotoContainer}>
          <MaterialIcons
            name="add-a-photo"
            size={40}
            color={COLORS.gray200}
          />
          <Text style={styles.addPhotoText}>Add a photo</Text>
        </TouchableOpacity>

        {/* Plant Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plant Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Monstera Deliciosa"
            value={plantName}
            onChangeText={setPlantName}
          />
        </View>

        {/* Plant Type (simple text input for now) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plant Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Succulent, Fern..."
            value={plantType}
            onChangeText={setPlantType}
          />
        </View>

        {/* Dates (just text inputs here; you can later integrate a DatePicker) */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Acquisition Date</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>First Watered</Text>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
          </View>
        </View>

        {/* Sunlight */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sunlight</Text>
          <TextInput
            style={styles.input}
            placeholder="Low / Indirect / Direct"
            value={sunlight}
            onChangeText={setSunlight}
          />
        </View>

        {/* Care Notes */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Care Notes</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="e.g., Water once a week..."
            value={careNotes}
            onChangeText={setCareNotes}
            multiline
          />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Add Plant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddPlantScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  closeButton: { padding: 4 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  screenContainer: { padding: 16 },
  addPhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    marginBottom: 20,
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: COLORS.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  row: { flexDirection: "row", marginBottom: 16 },
  stickyButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
