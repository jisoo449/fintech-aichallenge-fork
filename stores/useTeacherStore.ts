import { create } from 'zustand';
import type {
  PolicyProposal,
  PolicySimulationResponse,
} from '@/features/teacher/types';

type TeacherState = {
  selectedProposal: PolicyProposal | null;
  simulation: PolicySimulationResponse | null;
  setSelectedProposal: (proposal: PolicyProposal) => void;
  setSimulation: (result: PolicySimulationResponse) => void;
  resetPolicy: () => void;
};

export const useTeacherStore = create<TeacherState>((set) => ({
  selectedProposal: null,
  simulation: null,
  setSelectedProposal: (selectedProposal) =>
    set({ selectedProposal, simulation: null }),
  setSimulation: (simulation) => set({ simulation }),
  resetPolicy: () => set({ selectedProposal: null, simulation: null }),
}));
