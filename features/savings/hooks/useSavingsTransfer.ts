import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { transferSavings } from '../api';

export function useSavingsTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferSavings,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts'],
      });

      queryClient.invalidateQueries({
        queryKey: ['savings-summary'],
      });

      queryClient.invalidateQueries({
        queryKey: ['savings-goal'],
      });

      queryClient.invalidateQueries({
        queryKey: ['savings-trends'],
      });

      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });

      queryClient.invalidateQueries({
        queryKey: ['student-dashboard'],
      });
    },
  });
}