import { useQuery } from '@tanstack/react-query';

import { getSavingsSummary } from '../api';

export function useSavingsSummary() {
  return useQuery({
    queryKey: ['savings-summary'],
    queryFn: getSavingsSummary,
  });
}