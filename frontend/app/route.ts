import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { communityPosts } from '../lib/community-posts';
import { finalizeStitchHtml } from '../lib/stitch-html';

export const runtime = 'nodejs';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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

function renderHomeCommunityItems() {
  return communityPosts
    .slice(0, 5)
    .map(
      (post) => `
      <a class="block bg-surface-container-lowest p-6 rounded-xl flex items-start md:items-center gap-6 hover:translate-x-2 transition-transform duration-300 cursor-pointer border border-transparent hover:border-outline-variant/30" href="/community/post/${post.id}">
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

export function GET() {
  const templatePath = join(process.cwd(), 'stitch', 'home.html');
  const rawHtml = readFileSync(templatePath, 'utf8');
  const html = finalizeStitchHtml(
    'home',
    rawHtml.replace('{{HOME_COMMUNITY_ITEMS}}', renderHomeCommunityItems())
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
