import { fetchAuthState, isBackendApiError, type AuthState } from './backend-api';

function sanitizePath(value: string, fallback = '/') {
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return fallback;
  }
  return trimmed;
}

export function redirectToLogin(request: Request, nextPath?: string) {
  const currentPath =
    nextPath ||
    sanitizePath(new URL(request.url).pathname + new URL(request.url).search, '/');
  return Response.redirect(
    new URL(`/login?error=auth_required&next=${encodeURIComponent(currentPath)}`, request.url),
    302
  );
}

export function redirectToOnboarding(request: Request, nextPath?: string) {
  const currentPath =
    nextPath ||
    sanitizePath(new URL(request.url).pathname + new URL(request.url).search, '/');
  return Response.redirect(
    new URL(`/onboarding?next=${encodeURIComponent(currentPath)}`, request.url),
    302
  );
}

export async function requireAuthenticatedPage(
  request: Request,
  options?: { nextPath?: string; allowPendingOnboarding?: boolean }
): Promise<{ authState: AuthState } | { response: Response }> {
  const cookieHeader = request.headers.get('cookie') ?? undefined;
  let authState: AuthState;
  try {
    authState = await fetchAuthState(cookieHeader);
  } catch (error) {
    if (isBackendApiError(error)) {
      return {
        response: renderStatusPage({
          title: '은금슬쩍 | 연결 상태를 확인해 주세요',
          eyebrow: '보호된 페이지',
          heading: '지금은 로그인 상태를 확인하지 못해요',
          body: error.message,
          actionHref: '/',
          actionLabel: '홈으로 가기',
          status: error.status >= 500 ? error.status : 503
        })
      };
    }
    throw error;
  }

  if (!authState.authenticated || !authState.user) {
    return { response: redirectToLogin(request, options?.nextPath) };
  }

  if (!options?.allowPendingOnboarding && authState.user.requiresOnboarding) {
    return { response: redirectToOnboarding(request, options?.nextPath) };
  }

  return { authState };
}

export function renderStatusPage(options: {
  title: string;
  eyebrow: string;
  heading: string;
  body: string;
  actionHref: string;
  actionLabel: string;
  status?: number;
}) {
  return new Response(
    `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${options.title}</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">${options.eyebrow}</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">${options.heading}</h1>
    <p class="text-sm leading-7 text-[#4d4635]">${options.body}</p>
    <a href="${options.actionHref}" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">${options.actionLabel}</a>
  </main>
</body></html>`,
    {
      status: options.status ?? 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    }
  );
}
