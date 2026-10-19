import { useQuery } from '@tanstack/react-query';
import { getCreditReport } from '../api';

export function useCreditReport(yearMonth: string) {
  return useQuery({
    queryKey: ['credit-report', yearMonth],
    queryFn: () => getCreditReport(yearMonth),
    enabled: Boolean(yearMonth),
    retry: false,
  });
}