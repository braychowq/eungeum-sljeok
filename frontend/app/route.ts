import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  escapeHtml,
  fetchCommunityPosts,
  fetchStudios,
  formatPrice,
  type CommunityPostSummary,
  type StudioSummary
} from '../lib/backend-api';
import { finalizeStitchHtml } from '../lib/stitch-html';

export const runtime = 'nodejs';

function homeCategoryBadge(category: string) {
  if (category === 'free') {
    return '<span class="text-[10px] font-label text-primary uppercase tracking-widest mb-1 block">아무말</span>';
  }

  if (category === 'qa') {
    return '<span class="text-[10px] font-label text-primary uppercase tracking-widest mb-1 block">Q/A</span>';
  }

  return '<span class="text-[10px] font-label text-secondary uppercase tracking-widest mb-1 block">장터</span>';
}

function homeCategoryPreview(category: string) {
  if (category === 'free') {
    return `
      <div class="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center text-outline-variant flex-shrink-0">
        <span class="material-symbols-outlined text-4xl">chat</span>
      </div>
    `;
  }

  if (category === 'qa') {
    return `
      <div class="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center text-outline-variant flex-shrink-0">
        <span class="material-symbols-outlined text-4xl">help</span>
      </div>
    `;
  }

  return `
    <div class="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center text-outline-variant flex-shrink-0">
      <span class="material-symbols-outlined text-4xl">storefront</span>
    </div>
  `;
}

function likeCount(views: number) {
  return Math.max(3, Math.round(views * 0.18));
}

function renderHomeCommunityItems(posts: CommunityPostSummary[]) {
  return posts
    .map(
      (post) => `
      <a class="block bg-surface-container-lowest p-6 rounded-xl flex items-start md:items-center gap-6 hover:translate-x-2 transition-transform duration-300 cursor-pointer border border-transparent hover:border-outline-variant/30" href="/community/post/${post.slug}">
        ${homeCategoryPreview(post.category)}
        <div class="flex-grow min-w-0">
          ${homeCategoryBadge(post.category)}
          <h4 class="font-medium text-on-surface text-lg">${escapeHtml(post.title)}</h4>
          <p class="text-sm text-on-surface-variant font-light mt-1">${escapeHtml(post.excerpt)}</p>
        </div>
        <div class="flex gap-4 items-center">
          <div class="flex flex-col items-center">
            <span class="material-symbols-outlined text-outline">favorite</span>
            <span class="text-[10px] mt-1 font-label">${likeCount(post.views)}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="material-symbols-outlined text-outline">chat_bubble</span>
            <span class="text-[10px] mt-1 font-label">${post.comments}</span>
          </div>
        </div>
      </a>`
    )
    .join('');
}

function renderHomeStudioItems(studios: StudioSummary[]) {
  return studios
    .map((studio) => {
      const imageUrl = studio.imageUrls[0] || '';
      const district = escapeHtml(studio.location.split(' ')[0] || studio.location);
      return `
      <div class="min-w-[400px] snap-start">
        <a class="block bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group" href="/market/studio/${studio.slug}">
          <div class="relative h-72 overflow-hidden">
            <img alt="${escapeHtml(studio.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="${escapeHtml(studio.name)}" src="${escapeHtml(imageUrl)}"/>
            <div class="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-label uppercase tracking-widest">${district}</div>
          </div>
          <div class="p-8">
            <h3 class="font-headline text-xl mb-2">${escapeHtml(studio.name)}</h3>
            <p class="text-on-surface-variant text-sm mb-6 line-clamp-2">${escapeHtml(studio.description)}</p>
            <div class="flex justify-between items-center pt-4 border-t border-surface-container">
              <span class="font-label text-xs tracking-widest uppercase opacity-60">${escapeHtml(studio.priceUnit)}</span>
              <span class="font-headline text-lg text-primary">₩${formatPrice(studio.priceAmount)}</span>
            </div>
          </div>
        </a>
      </div>`;
    })
    .join('');
}

function renderErrorFallback() {
  return `
    <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 text-sm text-on-surface-variant">
      데이터를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
    </div>`;
}

export async function GET() {
  const templatePath = join(process.cwd(), 'stitch', 'home.html');
  const rawHtml = readFileSync(templatePath, 'utf8');

  let studioHtml = renderErrorFallback();
  let communityHtml = renderErrorFallback();

  try {
    const [studioPayload, communityPayload] = await Promise.all([
      fetchStudios(3),
      fetchCommunityPosts({ page: 1, pageSize: 5 })
    ]);

    studioHtml = renderHomeStudioItems(studioPayload.items);
    communityHtml = renderHomeCommunityItems(communityPayload.items);
  } catch {
    // error UI already prepared
  }

  const html = finalizeStitchHtml(
    'home',
    rawHtml
      .replace('{{HOME_STUDIO_ITEMS}}', studioHtml)
      .replace('{{HOME_COMMUNITY_ITEMS}}', communityHtml)
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
