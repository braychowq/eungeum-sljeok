import { requireAuthenticatedPage } from '../../../lib/page-guards';
import { stitchHtmlResponse } from '../../../lib/stitch-html';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const guard = await requireAuthenticatedPage(request);
  if ('response' in guard) {
    return guard.response;
  }

  return stitchHtmlResponse('community-new');
}
