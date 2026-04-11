import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  avatarPlaceholderImage,
  escapeHtml,
  fetchStudioDetailForViewer,
  isBackendApiError,
  formatPrice
} from '../../../../lib/backend-api';
import { renderStatusPage } from '../../../../lib/page-guards';
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
  const cookieHeader = request.headers.get('cookie') ?? undefined;

  try {
    const studio = await fetchStudioDetailForViewer(studioId, cookieHeader);
    const placeholderImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500" fill="none"><rect width="1200" height="1500" rx="48" fill="#f4f4f0"/><rect x="56" y="56" width="1088" height="1388" rx="40" fill="#ffffff"/><rect x="56" y="56" width="1088" height="220" rx="40" fill="#5f5e5e" opacity="0.12"/><text x="56" y="108" fill="#5f5e5e" font-family="Manrope, sans-serif" font-size="20" font-weight="700" letter-spacing="4">WORKSHOP IMAGE</text><text x="56" y="152" fill="#2f3430" font-family="Manrope, sans-serif" font-size="42" font-weight="700">${escapeHtml(
        studio.name
      )}</text><text x="56" y="206" fill="#5c605c" font-family="Manrope, sans-serif" font-size="24">${escapeHtml(
        studio.location
      )}</text><text x="56" y="1324" fill="#5c605c" font-family="Manrope, sans-serif" font-size="24">사진을 준비 중이에요.</text></svg>`
    )}`;
    const [hero, galleryOne, galleryTwo] = [
      studio.imageUrls[0] || placeholderImage,
      studio.imageUrls[1] || studio.imageUrls[0] || placeholderImage,
      studio.imageUrls[2] || studio.imageUrls[1] || studio.imageUrls[0] || placeholderImage
    ];
    const contactHref = studio.viewerOwnsWorkshop
      ? `/messages?workshop=${encodeURIComponent(studio.slug)}`
      : `/messages?start=${encodeURIComponent(studio.slug)}`;
    const contactLabel = studio.viewerOwnsWorkshop ? '대화 보기' : '문의하기';

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
        .replace('{{HOST_AVATAR_URL}}', avatarPlaceholderImage(studio.ownerDisplayName || '메이커'))
        .replace('{{STUDIO_OWNER_NAME}}', escapeHtml(studio.ownerDisplayName || '메이커'))
        .replace(
          '{{STUDIO_OWNER_BIO}}',
          escapeHtml(
            `${studio.ownerDisplayName || '호스트'} 님의 공간이에요. ${studio.description}`
          )
        )
        .replace('{{HOST_META_PRIMARY_LABEL}}', '카테고리')
        .replace('{{HOST_META_PRIMARY_VALUE}}', escapeHtml(studio.category))
        .replace('{{HOST_META_SECONDARY_LABEL}}', '등록일')
        .replace('{{HOST_META_SECONDARY_VALUE}}', escapeHtml(studio.createdAt))
        .replace('{{STUDIO_PRICE}}', formatPrice(studio.priceAmount))
        .replace('{{STUDIO_SLUG}}', escapeHtml(studio.slug))
        .replace('{{STUDIO_CONTACT_HREF}}', escapeHtml(contactHref))
        .replace('{{STUDIO_CONTACT_LABEL}}', contactLabel)
    );

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  } catch (error) {
    if (isBackendApiError(error) && error.status === 404) {
      return renderStatusPage({
        title: '은금슬쩍 | 공방을 찾을 수 없어요',
        eyebrow: '공방',
        heading: '공방을 찾을 수 없어요',
        body: '지금은 보이지 않는 공간이에요.',
        actionHref: '/market',
        actionLabel: '전체 공방 보기',
        status: 404
      });
    }

    if (isBackendApiError(error)) {
      return renderStatusPage({
        title: '은금슬쩍 | 공방을 불러오지 못했어요',
        eyebrow: '공방',
        heading: '지금은 공방을 불러오지 못해요',
        body: error.message,
        actionHref: '/market',
        actionLabel: '전체 공방 보기',
        status: error.status >= 500 ? error.status : 503
      });
    }

    throw error;
  }
}
