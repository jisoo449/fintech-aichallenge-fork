import { NextRequest, NextResponse } from 'next/server';

// 백엔드 주소 (환경변수에서 로드)
function getBackendBaseUrl(): string {
  const raw =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8080';

  return raw
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api(\/v1)?$/, '');
}

async function proxyHandler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const subPath = path.join('/');
  const search = request.nextUrl.search;

  const backendBase = getBackendBaseUrl();
  const targetUrl = `${backendBase}/api/${subPath}${search}`;

  // 1. 요청 헤더 준비 (hop-by-hop 및 압축 헤더 제외하여 항상 평문 전달)
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (
      !['host', 'connection', 'content-length', 'accept-encoding'].includes(
        lower,
      )
    ) {
      forwardHeaders.set(key, value);
    }
  });

  // 2. 바디 복사 (GET, HEAD가 아닐 때만)
  let body: ArrayBuffer | undefined = undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.arrayBuffer();
    } catch {
      // body 없음
    }
  }

  try {
    // 3. 백엔드로 직접 전송 (CORS 제약 없음)
    const backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(25000),
    });

    const text = await backendResponse.text();

    // 4. 응답 헤더 복사 (압축 및 불필요한 인코딩 헤더 제거하여 Next.js 500 스트림 충돌 방지)
    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (
        ![
          'content-encoding',
          'content-length',
          'transfer-encoding',
          'connection',
          'keep-alive',
        ].includes(lower)
      ) {
        responseHeaders.set(key, value);
      }
    });

    if (!responseHeaders.has('content-type')) {
      responseHeaders.set('content-type', 'application/json; charset=utf-8');
    }

    return new NextResponse(text, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    console.error(`[API Proxy Error] Failed to fetch ${targetUrl}:`, err);
    return NextResponse.json(
      {
        message: `백엔드 서버(${backendBase}) 연결에 실패했습니다. 백엔드가 실행 중인지 확인해 주세요.`,
        error: err instanceof Error ? err.message : String(err),
        targetUrl,
      },
      { status: 502 },
    );
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
export const OPTIONS = proxyHandler;
