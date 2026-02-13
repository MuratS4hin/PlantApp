import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAppStore = create(
  persist(
    (set, get) => ({
      AllPlants: [],

      // Get a plant by ID
      getPlant: (id) => {
        const state = get();
        return state.AllPlants.find((p) => p.id === id);
      },

      // Add a new plant
      addPlant: (plant) =>
        set((state) => ({
          AllPlants: [...state.AllPlants, plant],
        })),

      // Replace all plants (sync from backend)
      setPlants: (plants) => set({ AllPlants: plants }),

      // Update a plant by ID
      updatePlant: (updatedPlant) =>
        set((state) => ({
          AllPlants: state.AllPlants.map((p) =>
            p.id === updatedPlant.id ? updatedPlant : p
          ),
        })),

      // Delete a plant by ID
      deletePlant: (id) =>
        set((state) => ({
          AllPlants: state.AllPlants.filter((p) => p.id !== id),
        })),

      // Clear all plants
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
