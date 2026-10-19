'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type UserRole } from '@/stores/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('STUDENT' | 'TEACHER' | UserRole)[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, token, isHydrated } = useAuthStore();

  const currentRole = user?.role?.toUpperCase();
  const hasRolePermission =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    Boolean(
      currentRole &&
      allowedRoles.some((role) => role.toUpperCase() === currentRole),
    );

  const isAuthorized =
    isHydrated &&
    isAuthenticated &&
    Boolean(token) &&
    Boolean(user) &&
    hasRolePermission;

  useEffect(() => {
    if (!isHydrated) return;

    // 1. 비로그인 상태 체크
    if (!isAuthenticated || !token || !user) {
      router.replace('/');
      return;
    }

    // 2. 역할(Role) 접근 권한 체크
    if (allowedRoles && allowedRoles.length > 0 && !hasRolePermission) {
      if (currentRole === 'TEACHER') {
        router.replace('/teacher/dashboard');
      } else if (currentRole === 'STUDENT') {
        router.replace('/dashboard');
      } else {
        useAuthStore.getState().logout();
        router.replace('/');
      }
    }
  }, [
    isAuthenticated,
    user,
    token,
    isHydrated,
    allowedRoles,
    hasRolePermission,
    currentRole,
    router,
  ]);

  // 인증/권한 검사 중 로딩 화면
  if (!isHydrated || !isAuthorized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F6F8]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#075F46] border-t-transparent" />
          <p className="text-sm font-semibold text-gray-600">
            사용자 정보를 확인하고 있습니다...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
