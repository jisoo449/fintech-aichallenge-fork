import { apiFetch, ApiError } from '@/lib/api/fetcher';
import { useAuthStore, type AuthUser } from '@/stores/useAuthStore';

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export async function loginApi(request: LoginRequest): Promise<LoginResponse> {
  const payload: LoginRequest = {
    loginId: request.loginId.trim(),
    password: request.password,
  };

  let response: LoginResponse;

  try {
    response = await apiFetch<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      // 404 폴백: /api/v1/login 시도
      try {
        response = await apiFetch<LoginResponse>('/api/v1/login', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch {
        throw err;
      }
    } else {
      throw err;
    }
  }

  if (
    !response?.accessToken ||
    !response?.user ||
    !['STUDENT', 'TEACHER'].includes(response.user.role?.toUpperCase())
  ) {
    throw new Error(
      '로그인 응답의 사용자 정보를 확인할 수 없습니다. 다시 시도해 주세요.',
    );
  }

  if (response?.accessToken && response?.user) {
    useAuthStore.getState().login(response.accessToken, response.user);
  }

  return response;
}

export async function logoutApi(): Promise<void> {
  try {
    try {
      await apiFetch<LogoutResponse>('/api/v1/auth/logout', {
        method: 'POST',
      });
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 404) {
        await apiFetch<LogoutResponse>('/api/v1/logout', {
          method: 'POST',
        });
      } else {
        throw err;
      }
    }
  } catch (err: unknown) {
    // 401(이미 만료됨) 또는 기타 에러여도 클라이언트 토큰 삭제는 진행
    console.warn('[logoutApi] Server logout warning:', err);
  } finally {
    useAuthStore.getState().logout();
  }
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiFetch<{ user?: AuthUser } | AuthUser>('/api/v1/me');
  if ('user' in res && res.user) {
    return res.user;
  }
  return res as AuthUser;
}
