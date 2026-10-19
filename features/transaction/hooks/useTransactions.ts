import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../api';
import type { GetTransactionsParams } from '../types';

export function useTransactions(params: GetTransactionsParams = {}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
    retry: false,
  });
}