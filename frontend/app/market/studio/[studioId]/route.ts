import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml, fetchStudioDetail, formatPrice } from '../../../../lib/backend-api';
import { finalizeStitchHtml } from '../../../../lib/stitch-html';

export const runtime = 'nodejs';

function normalizeTel(value: string) {
  return value.replaceAll(/[^0-9+]/g, '');
}

function renderAmenities(items: string[]) {
  return (items.length ? items : ['장비 정보 준비 중'])
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
        .replace('{{STUDIO_OWNER_NAME}}', escapeHtml(studio.ownerDisplayName || '은금슬쩍 회원'))
        .replace(
          '{{STUDIO_OWNER_BIO}}',
          escapeHtml(
            `${studio.ownerDisplayName || '호스트'} 님이 운영하는 공간입니다. ${studio.description}`
          )
        )
        .replace('{{STUDIO_PRICE}}', formatPrice(studio.priceAmount))
        .replace('{{STUDIO_CONTACT_TEL}}', escapeHtml(normalizeTel(studio.contact)))
        .replace('{{STUDIO_CONTACT_LABEL}}', '문의하기')
    );

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
