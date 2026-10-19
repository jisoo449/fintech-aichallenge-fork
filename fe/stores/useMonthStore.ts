import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MonthState {
  selectedYear: number;
  selectedMonth: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  getYearMonthString: () => string;
}

export const useMonthStore = create<MonthState>()(
  persist(
    (set, get) => ({
      selectedYear: 2026,
      selectedMonth: 8,
      setMonth: (month: number) => set({ selectedMonth: month }),
      setYear: (year: number) => set({ selectedYear: year }),
      getYearMonthString: () => {
        const { selectedYear, selectedMonth } = get();
        const formattedMonth = String(selectedMonth).padStart(2, '0');
        return `${selectedYear}-${formattedMonth}`;
      },
    }),
    {
      name: 'seed-month-storage',
    }
  )
);
