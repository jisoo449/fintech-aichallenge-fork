'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ApiError } from '@/lib/api/fetcher';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => {
      const state = useAuthStore.getState();
      if (
        !state.token ||
        !state.user ||
        !['STUDENT', 'TEACHER'].includes(state.user.role?.toUpperCase())
      ) {
        state.logout();
      }
      state.setHydrated(true);
    });
  }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // 400, 401, 403, 404 등 클라이언트 4xx 에러는 재시도하지 않고 즉시 종료
              if (
                error instanceof ApiError &&
                error.status >= 400 &&
                error.status < 500
              ) {
                return false;
              }
              return failureCount < 1;
            },
            refetchOnWindowFocus: false, // 탭 전환/포커스 시 무한 재요청 방지
            staleTime: 1000 * 30, // 30초 동안 캐시 신선 유지
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
