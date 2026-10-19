import { useQuery } from '@tanstack/react-query';
import { getPayroll } from '../api';

export function usePayroll(yearMonth: string) {
  return useQuery({
    queryKey: ['payroll', yearMonth],
    queryFn: () => getPayroll(yearMonth),
    enabled: Boolean(yearMonth),
    retry: false, // 404 등 미존재 시 무한 재시도 방지
  });
}