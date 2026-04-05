import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml, fetchStudioDetail, formatPrice } from '../../../../lib/backend-api';
import { finalizeStitchHtml } from '../../../../lib/stitch-html';

export const runtime = 'nodejs';

function renderAmenities(items: string[]) {
  return (items.length ? items : ['기본 시설'])
    .map(
      (amenity) => `
      <div class="flex items-center justify-between group">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant" data-icon="construction">construction</span>
          </div>
          <span class="font-body text-sm font-medium">${escapeHtml(amenity)}</span>
        </div>
        <span class="text-[10px] uppercase tracking-widest text-outline">제공</span>
      </div>`
    )
    .join('');
}

export async function GET(request: Request) {
  const rawStudioId = new URL(request.url).pathname.split('/').pop() ?? '';
  const studioId = decodeURIComponent(rawStudioId);
  const templatePath = join(process.cwd(), 'stitch', 'market-detail.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  try {
    const studio = await fetchStudioDetail(studioId);
    const [hero, galleryOne, galleryTwo] = [
      studio.imageUrls[0] || '',
      studio.imageUrls[1] || studio.imageUrls[0] || '',
      studio.imageUrls[2] || studio.imageUrls[1] || studio.imageUrls[0] || ''
    ];

    const html = finalizeStitchHtml(
      'market-detail',
      rawTemplate
        .replaceAll('{{STUDIO_TITLE}}', escapeHtml(studio.name))
        .replace('{{HERO_IMAGE_URL}}', escapeHtml(hero))
        .replace('{{GALLERY_IMAGE_URL_1}}', escapeHtml(galleryOne))
        .replace('{{GALLERY_IMAGE_URL_2}}', escapeHtml(galleryTwo))
        .replace('{{STUDIO_LOCATION}}', escapeHtml(studio.location))
        .replace('{{STUDIO_DESCRIPTION}}', escapeHtml(studio.description))
        .replace('{{STUDIO_CAPACITY}}', String(studio.capacity))
        .replace('{{STUDIO_PRICE_UNIT}}', escapeHtml(studio.priceUnit))
        .replace('{{STUDIO_AMENITIES}}', renderAmenities(studio.amenities))
        .replace('{{STUDIO_OWNER_NAME}}', escapeHtml(studio.ownerDisplayName || '메이커'))
        .replace(
          '{{STUDIO_OWNER_BIO}}',
          escapeHtml(
            `${studio.ownerDisplayName || '호스트'} 님의 공간이에요. ${studio.description}`
          )
        )
        .replace('{{STUDIO_PRICE}}', formatPrice(studio.priceAmount))
        .replace('{{STUDIO_SLUG}}', escapeHtml(studio.slug))
        .replace('{{STUDIO_CONTACT_LABEL}}', '문의하기')
    );

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  } catch {
    return new Response(
      `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>공방을 찾을 수 없어요</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f6] text-[#2f3430] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">공방</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">공방을 찾을 수 없어요</h1>
    <p class="text-sm leading-7 text-[#4d4635]">지금은 보이지 않는 공간이에요.</p>
    <a href="/market" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">전체 공방 보기</a>
  </main>
</body></html>`,
      {
        status: 404,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store'
        }
      }
    );
  }
}
