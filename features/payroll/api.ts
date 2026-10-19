import { apiFetch } from '@/lib/api/fetcher';
import type { Payroll } from './types';

export function getPayroll(yearMonth: string): Promise<Payroll> {
  return apiFetch<Payroll>(`/api/v1/payrolls/${yearMonth}`);
}