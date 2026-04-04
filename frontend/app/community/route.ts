import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { communityPosts } from '../../lib/community-posts';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';
const PAGE_SIZES = [10, 20, 30] as const;
type CategoryFilter = 'all' | 'free' | 'qa' | 'market';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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

function likeCount(views: number) {
  return Math.max(3, Math.round(views * 0.18));
}

function filterPosts(query: string, category: CategoryFilter) {
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  return communityPosts.filter((post) => {
    if (category !== 'all' && post.category !== category) return false;
    if (!tokens.length) return true;

    const haystack = [
      post.title,
      post.excerpt,
      post.author,
      ...post.content,
      ...post.commentList.map((comment) => comment.body)
    ]
      .join(' ')
      .toLowerCase();

    return tokens.every((token) => haystack.includes(token));
  });
}

function renderPostRows(posts: typeof communityPosts) {
  return posts
    .map(
      (post) => `
      <article class="community-post" data-post-category="${post.category}">
        <a class="group bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6 hover:translate-x-2 transition-transform duration-300 cursor-pointer border border-transparent hover:border-outline-variant/30" href="/community/post/${post.id}">
          <div class="flex items-center gap-6 w-full">
            <div class="flex-shrink-0">${categoryPreview(post.category)}</div>
            <div class="min-w-0 flex-1">
              ${categoryBadge(post.category)}
              <h2 class="font-medium text-on-surface text-lg"><span class="group-hover:text-primary transition-colors">${post.title}</span></h2>
              <p class="text-sm text-on-surface-variant font-light mt-1">${post.excerpt}</p>
              <div class="flex flex-wrap gap-3 mt-3 text-[10px] font-label uppercase tracking-widest text-outline">
                <span>${post.author}</span>
                <span>${post.date}</span>
              </div>
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
          </div>
        </a>
      </article>`
    )
    .join('');
}

function categoryFilterHref(query: string, pageSize: number, category: CategoryFilter) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category !== 'all') params.set('category', category);
  params.set('page', '1');
  params.set('pageSize', String(pageSize));
  const qs = params.toString();
  return `/community${qs ? `?${qs}` : ''}`;
}

function renderCategoryFilters(query: string, pageSize: number, activeCategory: CategoryFilter) {
  const items: Array<{ value: CategoryFilter; label: string }> = [
    { value: 'all', label: '전체' },
    { value: 'free', label: '아무말' },
    { value: 'qa', label: 'Q/A' },
    { value: 'market', label: '장터' }
  ];

  return items
    .map((item) => {
      const activeClass = item.value === activeCategory ? ' is-active' : '';
      return `<a class="community-filter${activeClass}" href="${categoryFilterHref(
        query,
        pageSize,
        item.value
      )}">${item.label}</a>`;
    })
    .join('');
}

function pageSizeHref(query: string, category: CategoryFilter, pageSize: number) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category !== 'all') params.set('category', category);
  params.set('page', '1');
  params.set('pageSize', String(pageSize));
  return `/community?${params.toString()}`;
}

function renderPageSizeButtons(
  query: string,
  category: CategoryFilter,
  currentPageSize: number
) {
  return PAGE_SIZES.map((size) => {
    const activeClass = size === currentPageSize ? ' is-active' : '';
    return `<a class="community-page-size-button${activeClass}" href="${pageSizeHref(
      query,
      category,
      size
    )}">${size}</a>`;
  }).join('');
}

function renderEmptyState(hasPosts: boolean) {
  if (hasPosts) return '';

  return `
    <div class="bg-surface-container-lowest p-6 rounded-xl mt-4 text-center text-outline border border-transparent hover:border-outline-variant/30">
      <p class="font-headline text-2xl text-on-surface mb-3">일치하는 게시글이 없어요</p>
      <p class="text-sm">다른 검색어를 입력하거나 카테고리를 바꿔보세요.</p>
    </div>`;
}

function renderPaginationBar(
  query: string,
  category: CategoryFilter,
  pageSize: number,
  currentPage: number,
  totalPages: number
) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    return `/community?${params.toString()}`;
  };

  const links: string[] = [];
  const windowStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const windowEnd = Math.min(totalPages, windowStart + 9);

  if (windowStart > 1) {
    links.push(
      `<a aria-label="이전 페이지 구간" class="inline-flex items-center justify-center min-w-10 h-10 rounded-full border border-outline-variant/20 text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors px-3" href="${buildHref(Math.max(1, windowStart - 10))}">‹</a>`
    );
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    const active = page === currentPage;
    links.push(
      `<a class="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-label transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'border border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-primary'
      }" href="${buildHref(page)}">${page}</a>`
    );
  }

  if (windowEnd < totalPages) {
    links.push(
      `<a aria-label="다음 페이지 구간" class="inline-flex items-center justify-center min-w-10 h-10 rounded-full border border-outline-variant/20 text-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors px-3" href="${buildHref(windowEnd + 1)}">›</a>`
    );
  }

  return links.join('');
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get('q') ?? '';
  const categoryParam = params.get('category');
  const pageSizeParam = Number(params.get('pageSize') ?? '10');
  const pageParam = Number(params.get('page') ?? '1');
  const category: CategoryFilter =
    categoryParam === 'free' || categoryParam === 'qa' || categoryParam === 'market'
      ? categoryParam
      : 'all';
  const pageSize = PAGE_SIZES.includes(pageSizeParam as (typeof PAGE_SIZES)[number])
    ? pageSizeParam
    : 10;
  const filteredPosts = filterPosts(query, category);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.min(pageParam, totalPages) : 1;
  const startIndex = (currentPage - 1) * pageSize;
  const pagedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);
  const templatePath = join(process.cwd(), 'stitch', 'community.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  const html = finalizeStitchHtml(
    'community',
    rawTemplate
      .replace('{{SEARCH_VALUE}}', escapeHtml(query))
      .replace('{{CURRENT_CATEGORY}}', category)
      .replace('{{CURRENT_PAGE_SIZE}}', String(pageSize))
      .replace('{{CATEGORY_FILTERS}}', renderCategoryFilters(query, pageSize, category))
      .replace('{{PAGE_SIZE_BUTTONS}}', renderPageSizeButtons(query, category, pageSize))
      .replace('{{COMMUNITY_POST_ROWS}}', renderPostRows(pagedPosts))
      .replace('{{EMPTY_STATE}}', renderEmptyState(pagedPosts.length > 0))
      .replace(
        '{{PAGINATION_BAR}}',
        renderPaginationBar(query, category, pageSize, currentPage, totalPages)
      )
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
