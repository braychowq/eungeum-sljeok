import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { defaultStudioHeroImage, studioHeroImages } from '../../../../lib/studio-hero-images';
import { finalizeStitchHtml } from '../../../../lib/stitch-html';

export const runtime = 'nodejs';

export function GET(request: Request) {
  const rawStudioId = new URL(request.url).pathname.split('/').pop() ?? '';
  const studioId = decodeURIComponent(rawStudioId);
  const heroImage = studioHeroImages[studioId] ?? defaultStudioHeroImage;
  const templatePath = join(process.cwd(), 'stitch', 'market-detail.html');
  const rawHtml = readFileSync(templatePath, 'utf8');

  const html = finalizeStitchHtml(
    'market-detail',
    rawHtml
      .replace(
        `alt="${defaultStudioHeroImage.alt}" class="w-full h-full object-cover" data-alt="Close-up of a potter's hands shaping raw clay on a wooden wheel in a sunlit minimalist studio with warm textures" src="${defaultStudioHeroImage.src}"`,
        `alt="${heroImage.alt}" class="w-full h-full object-cover" data-alt="${heroImage.alt}" src="${heroImage.src}"`
      )
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
