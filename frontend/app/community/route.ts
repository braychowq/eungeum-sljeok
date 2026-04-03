import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { communityPosts } from '../../lib/community-posts';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

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

function renderPostRows(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];

  const filteredPosts = communityPosts.filter((post) => {
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

  return filteredPosts
    .map(
      (post) => `
      <article class="community-post" data-post-category="${post.category}">
        <a class="group bg-surface-container-lowest p-6 rounded-xl flex items-start md:items-center gap-6 hover:translate-x-2 transition-transform duration-300 cursor-pointer border border-transparent hover:border-outline-variant/30" href="/community/post/${post.id}">
          <div class="flex items-start md:items-center gap-6 w-full">
            <div class="flex-shrink-0">${categoryPreview(post.category)}</div>
            <div class="min-w-0 flex-1">
              ${categoryBadge(post.category)}
              <h2 class="font-medium text-on-surface text-lg"><span class="group-hover:text-primary transition-colors">${post.title}</span></h2>
              <p class="text-sm text-on-surface-variant font-light mt-1">${post.excerpt}</p>
              <div class="md:hidden flex flex-wrap gap-3 mt-3 text-[10px] font-label uppercase tracking-widest text-outline">
                <span>${post.author}</span>
                <span>${post.date}</span>
                <span>조회 ${post.views}</span>
                <span>댓글 ${post.comments}</span>
              </div>
            </div>
            <div class="hidden md:flex gap-4 items-center">
              <div class="flex flex-col items-center">
                <span class="material-symbols-outlined text-outline">visibility</span>
                <span class="text-[10px] mt-1 font-label">${post.views}</span>
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

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const templatePath = join(process.cwd(), 'stitch', 'community.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  const html = finalizeStitchHtml(
    'community',
    rawTemplate
      .replace('{{SEARCH_VALUE}}', escapeHtml(query))
      .replace('{{COMMUNITY_POST_ROWS}}', renderPostRows(query))
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
