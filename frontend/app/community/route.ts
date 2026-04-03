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
    return `<span class="inline-flex px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label uppercase tracking-[0.2em]">아무말</span>`;
  }

  if (category === 'qa') {
    return `<span class="inline-flex px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[10px] font-label uppercase tracking-[0.2em]">Q/A</span>`;
  }

  return `<span class="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-label uppercase tracking-[0.2em]">장터</span>`;
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
      <article class="community-post px-6 md:px-8 py-6 hover:bg-surface-container-low/40 transition-colors" data-post-category="${post.category}">
        <div class="grid md:grid-cols-[110px_minmax(0,1fr)_120px_110px_70px_70px] gap-4 md:gap-6 items-start md:items-center">
          <div>${categoryBadge(post.category)}</div>
          <div class="min-w-0">
            <h2 class="text-2xl font-headline mb-2 text-on-surface"><a class="hover:text-primary transition-colors" href="/community/post/${post.id}">${post.title}</a></h2>
            <p class="text-sm text-outline leading-relaxed">${post.excerpt}</p>
            <div class="md:hidden flex flex-wrap gap-3 mt-3 text-[11px] uppercase tracking-widest text-outline">
              <span>${post.author}</span><span>${post.date}</span><span>조회 ${post.views}</span><span>댓글 ${post.comments}</span>
            </div>
          </div>
          <div class="hidden md:block text-sm text-on-surface-variant">${post.author}</div>
          <div class="hidden md:block text-sm text-on-surface-variant">${post.date}</div>
          <div class="hidden md:block text-sm text-on-surface-variant">${post.views}</div>
          <div class="hidden md:block text-sm text-on-surface-variant">${post.comments}</div>
        </div>
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
