import { useQueries, useQuery } from '@tanstack/react-query';
import {
  DEFAULT_CLASSROOM_ID,
  getClassroomDashboard,
  getClassroomIndicators,
  getClassroomStudentsEconomy,
  getRandomEconomicEvent,
} from '../api';

export function useTeacherDashboard(classroomId = DEFAULT_CLASSROOM_ID) {
  const results = useQueries({
    queries: [
      {
        queryKey: ['classroom-dashboard', classroomId],
        queryFn: () => getClassroomDashboard(classroomId),
      },
      {
        queryKey: ['classroom-indicators', classroomId],
        queryFn: () => getClassroomIndicators(classroomId),
      },
      {
        queryKey: ['classroom-students-economy', classroomId],
        queryFn: () => getClassroomStudentsEconomy(classroomId),
      },
    ],
  });
  return {
    dashboard: results[0].data,
    indicators: results[1].data,
    students: results[2].data,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    error: results.find((r) => r.error)?.error,
    refetch: () => Promise.all(results.map((r) => r.refetch())),
  };
}

export function useRandomEconomicEvent(enabled = false) {
  return useQuery({
    queryKey: ['random-economic-event'],
    queryFn: getRandomEconomicEvent,
    enabled,
    staleTime: 0,
  });
}
