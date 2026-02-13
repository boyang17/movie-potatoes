import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useViewStore = create(
  persist(
    (set) => ({
      view: "Detailed",
      toggleView: (view) => set({ view }),
    }),
    {
      name: 'view-storage',
    }
  )
);