import { redirectToLogin } from '../../lib/page-guards';
import { fetchAuthState, isBackendApiError } from '../../lib/backend-api';
import { renderStatusPage } from '../../lib/page-guards';
import { stitchHtmlResponse } from '../../lib/stitch-html';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') ?? undefined;
    const authState = await fetchAuthState(cookieHeader);
    if (!authState.authenticated || !authState.user) {
      return redirectToLogin(request);
    }
    if (!authState.user.requiresOnboarding) {
      return Response.redirect(new URL('/account', request.url), 302);
    }
  } catch (error) {
    if (isBackendApiError(error)) {
      return renderStatusPage({
        title: '은금슬쩍 | 연결 상태를 확인해 주세요',
        eyebrow: '온보딩',
        heading: '지금은 정보를 불러오지 못해요',
        body: error.message,
        actionHref: '/',
        actionLabel: '홈으로 가기',
        status: error.status >= 500 ? error.status : 503
      });
    }
    throw error;
  }

  return stitchHtmlResponse('onboarding');
}
