import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  escapeHtml,
  fetchCommunityPosts,
  type CommunityPostSummary
} from '../../lib/backend-api';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';
type CategoryFilter = 'all' | 'free' | 'qa' | 'market';

function categoryBadge(category: string) {
  if (category === 'free') {
    return `<span class="text-[10px] font-label text-primary uppercase tracking-widest mb-1 block">아무말</span>`;
  }

  if (category === 'qa') {
    return `<span class="text-[10px] font-label text-primary uppercase tracking-widest mb-1 block">Q/A</span>`;
  }

  return `<span class="text-[10px] font-label text-secondary uppercase tracking-widest mb-1 block">장터</span>`;
}

function categoryPreview(category: string) {
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

function renderPostRows(posts: CommunityPostSummary[]) {
  return posts
    .map(
      (post) => `
      <article class="community-post" data-post-category="${post.category}">
        <a class="group bg-surface-container-lowest px-4 py-4 md:px-5 md:py-4 rounded-[1.1rem] flex items-center gap-4 hover:translate-x-1 transition-transform duration-300 cursor-pointer border border-transparent hover:border-outline-variant/30" href="/community/post/${post.slug}">
          <div class="flex items-center gap-4 w-full">
            <div class="flex-shrink-0">${categoryPreview(post.category).replaceAll('w-16 h-16', 'w-12 h-12').replaceAll('text-4xl', 'text-2xl')}</div>
            <div class="min-w-0 flex-1">
              ${categoryBadge(post.category)}
              <h2 class="font-medium text-on-surface text-base leading-6"><span class="group-hover:text-primary transition-colors">${escapeHtml(post.title)}</span></h2>
              <p class="mt-1 text-sm text-on-surface-variant font-light line-clamp-2">${escapeHtml(post.excerpt)}</p>
              <div class="flex flex-wrap gap-3 mt-2 text-[10px] font-label uppercase tracking-widest text-outline">
                <span>${escapeHtml(post.author)}</span>
                <span>${escapeHtml(post.date)}</span>
              </div>
            </div>
            <div class="flex gap-3 items-center self-center">
              <div class="flex flex-col items-center">
                <span class="material-symbols-outlined text-outline text-[18px]">visibility</span>
                <span class="text-[10px] mt-1 font-label">${post.views}</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="material-symbols-outlined text-outline text-[18px]">chat_bubble</span>
                <span class="text-[10px] mt-1 font-label">${post.comments}</span>
              </div>
            </div>
          </div>
        </a>
      </article>`
    )
    .join('');
}

function categoryFilterHref(query: string, category: CategoryFilter) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category !== 'all') params.set('category', category);
  const qs = params.toString();
  return `/community${qs ? `?${qs}` : ''}`;
}

function renderCategoryFilters(query: string, activeCategory: CategoryFilter) {
  const items: Array<{ value: CategoryFilter; label: string }> = [
    { value: 'all', label: '전체' },
    { value: 'free', label: '아무말' },
    { value: 'qa', label: 'Q/A' },
    { value: 'market', label: '장터' }
  ];

  return items
    .map((item) => {
      const activeClass = item.value === activeCategory ? ' is-active' : '';
      return `<a class="community-filter${activeClass}" href="${categoryFilterHref(query, item.value)}">${item.label}</a>`;
    })
    .join('');
}

function renderEmptyState(hasPosts: boolean) {
  if (hasPosts) return '';

  return `
    <div class="bg-surface-container-lowest p-6 rounded-xl mt-4 text-center text-outline border border-transparent hover:border-outline-variant/30">
      <p class="font-headline text-2xl text-on-surface mb-3">아직 찾는 글이 없어요</p>
      <p class="text-sm">다른 말로 다시 찾아보세요.</p>
    </div>`;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get('q') ?? '';
  const categoryParam = params.get('category');
  const category: CategoryFilter =
    categoryParam === 'free' || categoryParam === 'qa' || categoryParam === 'market'
      ? categoryParam
      : 'all';
  const templatePath = join(process.cwd(), 'stitch', 'community.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  let items: CommunityPostSummary[] = [];
  let loadFailed = false;

  try {
    const payload = await fetchCommunityPosts({
      q: query,
      category: category === 'all' ? undefined : category,
      page: 1,
      pageSize: 10
    });
    items = payload.items;
  } catch {
    items = [];
    loadFailed = true;
  }

  const html = finalizeStitchHtml(
    'community',
    rawTemplate
      .replace('{{FETCH_ERROR}}', loadFailed ? `<div class="bg-[#fff4f1] border border-[#f0d4cd] px-5 py-4 rounded-xl text-sm text-[#8a3827] mb-6">지금은 글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div>` : '')
      .replace('{{SEARCH_VALUE}}', escapeHtml(query))
      .replace('{{CURRENT_CATEGORY}}', category)
      .replace('{{CATEGORY_FILTERS}}', renderCategoryFilters(query, category))
      .replace('{{COMMUNITY_POST_ROWS}}', renderPostRows(items))
      .replace('{{EMPTY_STATE}}', renderEmptyState(items.length > 0 || loadFailed))
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
