import { useQuery } from '@tanstack/react-query';
import { getMonthlyResults } from '../api';

export function useMonthlyResults(yearMonth: string) {
  return useQuery({
    queryKey: ['monthly-results', yearMonth],
    queryFn: () => getMonthlyResults(yearMonth),
    enabled: Boolean(yearMonth),
    retry: false,
  });
}
