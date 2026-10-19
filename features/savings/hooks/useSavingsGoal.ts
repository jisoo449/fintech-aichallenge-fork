import { useQuery } from '@tanstack/react-query';
import { getSavingsGoal } from '../api';

export function useSavingsGoal() {
  return useQuery({
    queryKey: ['savings-goal'],
    queryFn: getSavingsGoal,
  });
}
