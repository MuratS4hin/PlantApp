// store/useAppStore.js
import { create } from "zustand";

const useAppStore = create((set) => ({
  AllPlants: [],

  // Actions
  addPlant: (plant) =>
    set((state) => ({
      AllPlants: [...state.AllPlants, plant], // append new plant
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
}));

export default useAppStore;
