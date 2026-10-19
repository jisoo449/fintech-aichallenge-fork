import { useMutation } from '@tanstack/react-query';
import { DEFAULT_CLASSROOM_ID, simulatePolicy } from '../api';
import type { PolicySimulationRequest } from '../types';

export function usePolicySimulation(classroomId = DEFAULT_CLASSROOM_ID) {
  return useMutation({
    mutationFn: (request: PolicySimulationRequest) =>
      simulatePolicy(classroomId, request),
  });
}
