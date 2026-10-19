import { useQuery } from '@tanstack/react-query';

import { getSavingsRecommendations } from '../api';

export function useSavingsRecommendations() {
  return useQuery({
    queryKey: ['savings-recommendations'],
    queryFn: getSavingsRecommendations,
  });
}