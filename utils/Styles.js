import { StyleSheet } from "react-native";
import { COLORS } from "./Constants";

// --- Styles ---
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white },
  screenContainer: { padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary },
  headerRow: {flexDirection: "row",justifyContent: "flex-start",alignItems: "center",marginBottom: 12,},
  addButton: {backgroundColor: COLORS.primary,borderRadius: 20,padding: 0, marginLeft: 12,},
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 16 },
  taskCard: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: COLORS.white, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.gray200 },
  taskImage: { width: 64, height: 64, borderRadius: 8, marginRight: 16, alignContent: "center" },
  taskPlantName: { fontSize: 16, fontWeight: "500" },
  taskDetailText: { fontSize: 14, color: COLORS.textSecondary, fontSize: 16},
  taskDetail: { fontSize: 14, color: COLORS.primary},
  plantGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  plantCard: { width: "48%", backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray200, marginBottom: 16 },
  plantImage: { width: "100%", height: 128, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  plantInfo: { padding: 8 },
  plantName: { fontWeight: "600", fontSize: 15 },
  plantStatus: { fontSize: 13, color: COLORS.textSecondary },
  navBar: { flexDirection: "row", height: 70, borderTopWidth: 1, borderColor: COLORS.gray200, backgroundColor: COLORS.white },
  navItem: { flex: 1, justifyContent: "center", alignItems: "center" },
  navText: { fontSize: 11, marginTop: 4 },

});