import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  escapeHtml,
  fetchStudios,
  formatPrice,
  studioPlaceholderImage,
  type StudioSummary
} from '../../lib/backend-api';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

function renderStudioCards(studios: StudioSummary[]) {
  const items = studios
    .map((studio, index) => {
      const imageUrl = studio.imageUrls[0] || studioPlaceholderImage(studio.name, studio.location);
      const locationBadge = escapeHtml(studio.location.split(' ')[0] || studio.location);
      const amenityChips = (studio.amenities.length ? studio.amenities : ['기본 시설'])
        .slice(0, 3)
        .map(
          (amenity) =>
            `<span class="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] rounded-full">${escapeHtml(
              amenity
            )}</span>`
        )
        .join('');
      const newBadge =
        index === 0
          ? `<div class="absolute top-4 right-4"><span class="px-3 py-1 bg-primary text-on-primary text-[10px] uppercase tracking-widest font-bold rounded-full">New</span></div>`
          : '';

      return `
      <article class="group w-full max-w-[360px]" data-market-card="">
        <a class="market-card-image block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-surface-container-low" href="/market/studio/${studio.slug}">
          <img alt="${escapeHtml(studio.name)}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" data-alt="${escapeHtml(studio.name)}" src="${escapeHtml(imageUrl)}"/>
          <div class="absolute top-4 left-4 flex gap-2">
            <span class="px-3 py-1 bg-surface-container-lowest/90 backdrop-blur text-[10px] uppercase tracking-widest font-semibold rounded-full">${locationBadge}</span>
          </div>
          ${newBadge}
        </a>
        <div class="market-card-copy px-2">
          <div class="market-card-heading flex justify-between items-start mb-2">
            <h3 class="market-card-title font-headline text-2xl text-on-surface"><a href="/market/studio/${studio.slug}">${escapeHtml(studio.name)}</a></h3>
            <span class="market-card-price text-primary font-medium tracking-tight"><span class="text-[10px] text-outline font-normal uppercase mr-1">${escapeHtml(studio.priceUnit)}</span>₩${formatPrice(studio.priceAmount)}</span>
          </div>
          <p class="market-card-summary text-sm text-on-surface-variant font-light mb-4 line-clamp-2">${escapeHtml(studio.description)}</p>
          <div class="market-card-tags flex flex-wrap gap-2 mb-6">${amenityChips}</div>
          <a class="market-card-button block w-full py-3 border border-outline text-outline hover:bg-on-surface hover:text-surface hover:border-on-surface rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 text-center" href="/market/studio/${studio.slug}">
            둘러보기
          </a>
        </div>
      </article>`;
    })
    .join('');

  const cta = `
    <a class="flex flex-col items-center justify-center w-full max-w-[360px] p-12 border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-low transition-colors group cursor-pointer" data-market-cta="" href="/market/new">
      <div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <span class="material-symbols-outlined text-primary text-3xl">add</span>
      </div>
      <h3 class="font-headline text-xl text-center mb-2">내 공방 올리기</h3>
      <p class="text-sm text-center text-on-surface-variant font-light max-w-[200px]">함께 쓰고 싶은 공간을 소개해보세요.</p>
      <div class="mt-6 font-sans text-[10px] tracking-[0.2em] uppercase text-primary border-b border-primary pb-1">등록하기</div>
    </a>`;

  return items + cta;
}

export async function GET() {
  const templatePath = join(process.cwd(), 'stitch', 'market.html');
  const rawHtml = readFileSync(templatePath, 'utf8');

  let cardsHtml = `
    <div class="col-span-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-8 text-center text-sm text-on-surface-variant">
      지금은 공방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
    </div>`;

  try {
    const payload = await fetchStudios();
    cardsHtml = renderStudioCards(payload.items);
  } catch {
    // keep fallback
  }

  const html = finalizeStitchHtml('market', rawHtml.replace('{{MARKET_STUDIO_ITEMS}}', cardsHtml));

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
