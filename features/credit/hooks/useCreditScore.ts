import { useQuery } from '@tanstack/react-query';

import { getCreditScore } from '../api';

export function useCreditScore() {
  return useQuery({
    queryKey: ['credit-score'],
    queryFn: getCreditScore,
  });
}