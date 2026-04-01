import { stitchHtmlResponse } from '../../../lib/stitch-html';

export const runtime = 'nodejs';

export function GET() {
  return stitchHtmlResponse('market-new');
}
