import { apiFetch } from '@/lib/api/fetcher';
import type { CreditReportResponse, CreditScoreResponse } from './types';

export function getCreditReport(
  yearMonth: string,
): Promise<CreditReportResponse> {
  return apiFetch<CreditReportResponse>(
    `/api/v1/credit-reports/${yearMonth}`,
  );
}

export function getCreditScore(): Promise<CreditScoreResponse> {
  return apiFetch<CreditScoreResponse>('/api/v1/credit-score');
}