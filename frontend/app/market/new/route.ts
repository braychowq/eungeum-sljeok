import { stitchHtmlResponse } from '../../../lib/stitch-html';

export const runtime = 'nodejs';

const MOBILE_USER_AGENT_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export function GET(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? '';
  const template = MOBILE_USER_AGENT_PATTERN.test(userAgent)
    ? 'market-registration-mobile'
    : 'market-new';

  return stitchHtmlResponse(template);
}
