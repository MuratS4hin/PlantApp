import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../utils/Constants";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import useAppStore from "../store/UseAppStore";

const AddPlantScreen = ({ route, navigation }) => {
  const addPlant = useAppStore((state) => state.addPlant);
  const updatePlant = useAppStore((state) => state.updatePlant);

  const editPlant = route?.params?.plant || null; // Edit mode if plant exists

  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [careNotes, setCareNotes] = useState("");
  const [plantImage, setPlantImage] = useState(null);

  // Watering
  const [wateringNumber, setWateringNumber] = useState("0");
  const [wateringUnit, setWateringUnit] = useState("days");
  const [showWateringNumber, setShowWateringNumber] = useState(false);
  const [showWateringUnit, setShowWateringUnit] = useState(false);

  // Fertilizing
  const [fertilizingNumber, setFertilizingNumber] = useState("0");
  const [fertilizingUnit, setFertilizingUnit] = useState("months");
  const [showFertilizingNumber, setShowFertilizingNumber] = useState(false);
  const [showFertilizingUnit, setShowFertilizingUnit] = useState(false);

  // Sunlight
  const [sunlightValue, setSunlightValue] = useState("low");
  const [showSunlight, setShowSunlight] = useState(false);

  const numbers = Array.from({ length: 61 }, (_, i) => `${i}`);
  const timeUnits = ["days", "weeks", "months"];
  const sunlightItems = ["low", "medium", "indirect", "direct"];

  // Prefill data if editing
  useEffect(() => {
    if (editPlant) {
      setPlantName(editPlant.plantName);
      setPlantType(editPlant.plantType);
      setCareNotes(editPlant.careNotes);
      setPlantImage(editPlant.plantImage);
      setWateringNumber(String(editPlant.wateringNumber));
      setWateringUnit(editPlant.wateringUnit);
      setFertilizingNumber(String(editPlant.fertilizingNumber));
      setFertilizingUnit(editPlant.fertilizingUnit);
      setSunlightValue(editPlant.sunlight);
    }
  }, [editPlant]);

  const renderPickerField = (label, value, onPress) => (
    <TouchableOpacity style={styles.dropdownField} onPress={onPress}>
      <Text style={{ color: value ? COLORS.textPrimary : COLORS.textSecondary }}>
        {value || label}
      </Text>
      <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray400} />
    </TouchableOpacity>
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission required to access photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPlantImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const plantData = {
      id: editPlant ? editPlant.id : Date.now(),
      plantName,
      plantType,
      plantImage,
      wateringNumber,
      wateringUnit,
      wateringDayUnit:
        wateringNumber *
        (wateringUnit === "weeks" ? 7 : wateringUnit === "months" ? 30 : 1),
      sunlight: sunlightValue,
      fertilizingNumber,
      fertilizingUnit,
      fertilizingDayUnit:
        fertilizingNumber *
        (fertilizingUnit === "weeks" ? 7 : fertilizingUnit === "months" ? 30 : 1),
      careNotes,
      lastWatered: editPlant ? editPlant.lastWatered : Date.now(),
      lastFertilized: editPlant ? editPlant.lastFertilized : Date.now(),
    };

    if (editPlant) {
      updatePlant(plantData);
      alert("Plant updated successfully!");
    } else {
      addPlant(plantData);
      alert("Plant saved successfully!");
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.screenContainer}>
        {/* Photo Upload */}
        <TouchableOpacity style={styles.addPhotoContainer} onPress={pickImage}>
          {plantImage ? (
            <Image source={{ uri: plantImage }} style={styles.plantImage} />
          ) : (
            <>
              <MaterialIcons
                name="add-a-photo"
                size={40}
                color={COLORS.gray200}
              />
              <Text style={styles.addPhotoText}>Add a photo</Text>
            </>
          )}
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

        {/* Plant Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plant Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Succulent, Fern..."
            value={plantType}
            onChangeText={setPlantType}
          />
        </View>

        {/* Watering */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Watering</Text>
          <View style={styles.inlineRow}>
            {renderPickerField("Number", wateringNumber, () =>
              setShowWateringNumber(true)
            )}
            {renderPickerField("Unit", wateringUnit, () =>
              setShowWateringUnit(true)
            )}
          </View>
        </View>

        {/* Sunlight */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sunlight</Text>
          {renderPickerField("Select sunlight", sunlightValue, () =>
            setShowSunlight(true)
          )}
        </View>

        {/* Fertilizing */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fertilizing</Text>
          <View style={styles.inlineRow}>
            {renderPickerField("Number", fertilizingNumber, () =>
              setShowFertilizingNumber(true)
            )}
            {renderPickerField("Unit", fertilizingUnit, () =>
              setShowFertilizingUnit(true)
            )}
          </View>
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

        {/* Save/Update button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editPlant ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Pickers in Modals */}
      <Modal visible={showWateringNumber} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback
            onPress={() => setShowWateringNumber(false)}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            <Picker
              selectedValue={wateringNumber}
              onValueChange={(val) => setWateringNumber(val)}
            >
              {numbers.map((num) => (
                <Picker.Item key={num} label={num} value={num} color="black" />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWateringNumber(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showWateringUnit} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setShowWateringUnit(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            <Picker
              selectedValue={wateringUnit}
              onValueChange={(val) => setWateringUnit(val)}
            >
              {timeUnits.map((unit) => (
                <Picker.Item key={unit} label={unit} value={unit} color="black" />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWateringUnit(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSunlight} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setShowSunlight(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            <Picker
              selectedValue={sunlightValue}
              onValueChange={(val) => setSunlightValue(val)}
            >
              {sunlightItems.map((item) => (
                <Picker.Item key={item} label={item} value={item} color="black" />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSunlight(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFertilizingNumber} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback
            onPress={() => setShowFertilizingNumber(false)}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            <Picker
              selectedValue={fertilizingNumber}
              onValueChange={(val) => setFertilizingNumber(val)}
            >
              {numbers.map((num) => (
                <Picker.Item key={num} label={num} value={num} color="black" />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowFertilizingNumber(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFertilizingUnit} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback
            onPress={() => setShowFertilizingUnit(false)}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalBox}>
            <Picker
              selectedValue={fertilizingUnit}
              onValueChange={(val) => setFertilizingUnit(val)}
            >
              {timeUnits.map((unit) => (
                <Picker.Item key={unit} label={unit} value={unit} color="black" />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowFertilizingUnit(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddPlantScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  screenContainer: { padding: 16, paddingBottom: 100 },
  formGroup: { marginBottom: 16 },
  addPhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    marginBottom: 20,
  },
  plantImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
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
  inlineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dropdownField: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  overlay: { flex: 1 },
  saveButton: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  modalBox: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
  },
  modalButton: {
    padding: 14,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
