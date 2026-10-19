import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DEFAULT_CLASSROOM_ID,
  createEconomicAnalysis,
  getLatestEconomicAnalysis,
  getPolicyProposals,
} from '../api';

export function useLatestEconomicAnalysis(classroomId = DEFAULT_CLASSROOM_ID) {
  return useQuery({
    queryKey: ['economic-analysis-latest', classroomId],
    queryFn: () => getLatestEconomicAnalysis(classroomId),
  });
}
export function useCreateEconomicAnalysis(classroomId = DEFAULT_CLASSROOM_ID) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => createEconomicAnalysis(classroomId),
    onSuccess: (data) =>
      client.setQueryData(['economic-analysis-latest', classroomId], data),
  });
}
export function usePolicyProposals(classroomId = DEFAULT_CLASSROOM_ID) {
  return useQuery({
    queryKey: ['policy-proposals', classroomId],
    queryFn: () => getPolicyProposals(classroomId),
  });
}
