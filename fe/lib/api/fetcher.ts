import { useAuthStore } from '@/stores/useAuthStore';

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: unknown;

  constructor(status: number, message: string, code?: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isBrowser = typeof window !== 'undefined';
  const rawBase = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  // URL 중복 슬래시 및 중복 /api, /api/v1 제거
  const cleanBase = rawBase.trim().replace(/\/+$/, '');
  let cleanPath = path.trim().replace(/^\/+/, '');

  if (
    !isBrowser &&
    cleanBase.endsWith('/api/v1') &&
    cleanPath.startsWith('api/v1/')
  ) {
    cleanPath = cleanPath.slice(7);
  } else if (
    !isBrowser &&
    cleanBase.endsWith('/api') &&
    cleanPath.startsWith('api/')
  ) {
    cleanPath = cleanPath.slice(4);
  }

  // 브라우저에서는 Next.js 내부 프록시(/api/...)를 통해 호출하여 브라우저의 CORS 및 403 Preflight 차단 완전 방지
  // 서버 사이드(SSR)에서는 백엔드 전체 URL 직접 호출
  const url = isBrowser
    ? `/${cleanPath}`
    : cleanBase
      ? `${cleanBase}/${cleanPath}`
      : `/${cleanPath}`;

  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  // 클라이언트 환경에서 토큰 자동 첨부
  if (typeof window !== 'undefined' && !headers.has('Authorization')) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    credentials: options.credentials ?? 'include',
    ...options,
    headers,
    signal: options.signal ?? AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    if (response.status === 401 && isBrowser) {
      const isAuthEndpoint =
        cleanPath.includes('login') || cleanPath.includes('logout');
      if (!isAuthEndpoint) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/') {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = '/';
        }
      }
    }

    let errorMessage = `요청 실패 (상태 코드: ${response.status})`;
    let errorCode: string | undefined = undefined;
    let errorData: unknown = null;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null) {
          const rec = errorData as Record<string, unknown>;
          errorCode = (rec.code as string) || undefined;
          errorMessage =
            (rec.message as string) ||
            (rec.error as string) ||
            (rec.detail as string) ||
            JSON.stringify(errorData);
        }
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }
    } catch {
      // 응답 본문 파싱 에러 시 기본 에러 메시지 사용
    }

    throw new ApiError(response.status, errorMessage, errorCode, errorData);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  return text ? (text as unknown as T) : (undefined as T);
}
