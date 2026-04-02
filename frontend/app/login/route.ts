import { stitchHtmlResponse } from '../../lib/stitch-html';

export async function GET() {
  return stitchHtmlResponse('login');
}
