import { useQuery } from '@tanstack/react-query';

import { getStudentDashboard } from '../api';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
  });
}