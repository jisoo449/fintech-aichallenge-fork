import { apiFetch } from '@/lib/api/fetcher';
import type { StudentDashboardResponse } from './types';

export function getStudentDashboard(): Promise<StudentDashboardResponse> {
  return apiFetch<StudentDashboardResponse>('/api/v1/student/dashboard');
}