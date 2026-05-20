import { create } from "zustand";

export type SelectedModification = {
  id: string;
  name: string;
  price: number;
  categorySlug: string;
};

type ConfiguratorState = {
  step: 1 | 2;
  selectedCarId: string | null;
  selectedCarBasePrice: number;
  selectedCarLabel: string;
  selectedModifications: Record<string, SelectedModification>;
  setStep: (step: 1 | 2) => void;
  selectCar: (id: string, basePrice: number, label: string) => void;
  toggleModification: (mod: SelectedModification) => void;
  getTotalPrice: () => number;
  reset: () => void;
};

const initialState = {
  step: 1 as const,
  selectedCarId: null,
  selectedCarBasePrice: 0,
  selectedCarLabel: "",
  selectedModifications: {},
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  selectCar: (id, basePrice, label) =>
    set({
      selectedCarId: id,
      selectedCarBasePrice: basePrice,
      selectedCarLabel: label,
      step: 2,
      selectedModifications: {},
    }),
  toggleModification: (mod) =>
    set((state) => {
      const next = { ...state.selectedModifications };
      if (next[mod.categorySlug]?.id === mod.id) {
        delete next[mod.categorySlug];
      } else {
        next[mod.categorySlug] = mod;
      }
      return { selectedModifications: next };
    }),
  getTotalPrice: () => {
    const { selectedCarBasePrice, selectedModifications } = get();
    const modsTotal = Object.values(selectedModifications).reduce(
      (sum, m) => sum + m.price,
      0,
    );
    return selectedCarBasePrice + modsTotal;
  },
  reset: () => set(initialState),
}));
