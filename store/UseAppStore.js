// store/useAppStore.js
import { create } from "zustand";

const useAppStore = create((set) => ({
  AllPlants: [],

  // Actions
  addPlant: (plant) =>
    set((state) => ({
      AllPlants: [...state.AllPlants, plant], // append new plant
    })),

  updatePlant: (id, updates) =>
    set((state) => ({
      AllPlants: state.AllPlants.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  clearPlants: () => set({ AllPlants: [] }),
}));

export default useAppStore;
