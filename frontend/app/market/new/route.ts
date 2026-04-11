import { requireAuthenticatedPage } from '../../../lib/page-guards';
import { stitchHtmlResponse } from '../../../lib/stitch-html';

export const runtime = 'nodejs';

const MOBILE_USER_AGENT_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export async function GET(request: Request) {
  const guard = await requireAuthenticatedPage(request);
  if ('response' in guard) {
    return guard.response;
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  const template = MOBILE_USER_AGENT_PATTERN.test(userAgent)
    ? 'market-registration-mobile'
    : 'market-new';

  return stitchHtmlResponse(template);
}
