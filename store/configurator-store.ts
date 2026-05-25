import { create } from "zustand";

export type SelectedModification = {
  id: string;
  name: string;
  price: number;
  categorySlug: string;
};

export type ConfigStep = 1 | 2 | 3 | 4;

type LoadPayload = {
  brandSlug: string;
  brandName: string;
  model: string;
  year: number;
  basePrice: number;
  modifications: SelectedModification[];
};

type ConfiguratorState = {
  step: ConfigStep;
  brandSlug: string | null;
  brandName: string | null;
  model: string | null;
  year: number | null;
  basePrice: number;
  selectedModifications: Record<string, SelectedModification>;
  setStep: (step: ConfigStep) => void;
  selectBrand: (slug: string, name: string) => void;
  selectModel: (model: string) => void;
  selectYear: (year: number, basePrice: number) => void;
  toggleModification: (mod: SelectedModification) => void;
  loadFromConfiguration: (payload: LoadPayload) => void;
  getTotalPrice: () => number;
  reset: () => void;
};

const initialState = {
  step: 1 as ConfigStep,
  brandSlug: null,
  brandName: null,
  model: null,
  year: null,
  basePrice: 0,
  selectedModifications: {},
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  selectBrand: (slug, name) =>
    set({
      brandSlug: slug,
      brandName: name,
      model: null,
      year: null,
      basePrice: 0,
      selectedModifications: {},
      step: 2,
    }),
  selectModel: (model) =>
    set({
      model,
      year: null,
      basePrice: 0,
      selectedModifications: {},
      step: 3,
    }),
  selectYear: (year, basePrice) =>
    set({
      year,
      basePrice,
      step: 4,
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
  loadFromConfiguration: (payload) => {
    const byCategory: Record<string, SelectedModification> = {};
    for (const m of payload.modifications) {
      if (m.categorySlug) byCategory[m.categorySlug] = m;
    }
    set({
      brandSlug: payload.brandSlug,
      brandName: payload.brandName,
      model: payload.model,
      year: payload.year,
      basePrice: payload.basePrice,
      selectedModifications: byCategory,
      step: 4,
    });
  },
  getTotalPrice: () => {
    const { basePrice, selectedModifications } = get();
    const modsTotal = Object.values(selectedModifications).reduce(
      (sum, m) => sum + m.price,
      0,
    );
    return basePrice + modsTotal;
  },
  reset: () => set(initialState),
}));
