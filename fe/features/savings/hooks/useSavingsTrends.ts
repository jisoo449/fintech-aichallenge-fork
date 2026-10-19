import { useQuery } from '@tanstack/react-query';
import { getSavingsTrends } from '../api';

export function useSavingsTrends() {
  return useQuery({
    queryKey: ['savings-trends'],
    queryFn: getSavingsTrends,
  });
}
