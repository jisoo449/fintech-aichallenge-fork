import { create } from 'zustand';

export type SavingsViewTab = 'saving' | 'accounts';

interface SavingsState {
  currentTab: SavingsViewTab;
  setTab: (tab: SavingsViewTab) => void;
}

export const useSavingsStore = create<SavingsState>((set) => ({
  currentTab: 'saving',
  setTab: (tab: SavingsViewTab) => set({ currentTab: tab }),
}));
