import { create } from 'zustand';

interface ConversionsStore {
  conversions: string[];

  addConversion: (conversion: string) => void;

  removeConversion: (conversion: string) => void;
}

export const useConversionsStore = create<ConversionsStore>((set, get) => ({
  conversions: [],

  addConversion: (conversion: string) => {
    const { conversions } = get();

    set({ conversions: Array.from(new Set([...conversions, conversion])) });
  },

  removeConversion: (conversion: string) => {
    const { conversions } = get();

    set({ conversions: conversions.filter((c) => c !== conversion) });
  },
}));
