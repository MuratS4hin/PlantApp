import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAppStore = create(
  persist(
    (set) => ({
      AllPlants: [],

      // Actions
      addPlant: (plant) =>
        set((state) => ({
          AllPlants: [...state.AllPlants, plant],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          AllPlants: state.AllPlants.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      updatePlant: (updatedPlant) =>
        set((state) => ({
          AllPlants: state.AllPlants.map((p) =>
            p.id === updatedPlant.id ? updatedPlant : p
          ),
        })),

      deletePlant: (id) =>
        set((state) => ({
          AllPlants: state.AllPlants.filter((p) => p.id !== id),
        })),

      clearPlants: () => set({ AllPlants: [] }),
    }),
    {
      name: "plants-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ AllPlants: state.AllPlants }),
    }
  )
);

export default useAppStore;
