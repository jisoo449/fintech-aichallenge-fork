import { apiFetch } from '@/lib/api/fetcher';
import type { MonthlyResultsResponse } from './types';

export function getMonthlyResults(yearMonth: string): Promise<MonthlyResultsResponse> {
  return apiFetch<MonthlyResultsResponse>(`/api/v1/monthly-results/${yearMonth}`);
}
