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

function categoryPreview(category: string) {
  if (category === 'free') {
    return `
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#efe9dc] to-[#d7cec0] flex flex-col justify-between p-3 md:p-4 text-[#5f5e5e] shadow-sm">
        <span class="text-[9px] md:text-[10px] font-label uppercase tracking-[0.22em]">Talk</span>
        <span class="material-symbols-outlined text-[24px] md:text-[30px] leading-none">forum</span>
      </div>
    `;
  }

  if (category === 'qa') {
    return `
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#ece9e4] to-[#cec9c0] flex flex-col justify-between p-3 md:p-4 text-[#4d4635] shadow-sm">
        <span class="text-[9px] md:text-[10px] font-label uppercase tracking-[0.22em]">Q&amp;A</span>
        <span class="material-symbols-outlined text-[24px] md:text-[30px] leading-none">lightbulb</span>
      </div>
    `;
  }

  return `
    <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#f3ead0] to-[#d4af37] flex flex-col justify-between p-3 md:p-4 text-[#735c00] shadow-sm">
      <span class="text-[9px] md:text-[10px] font-label uppercase tracking-[0.22em]">Market</span>
      <span class="material-symbols-outlined text-[24px] md:text-[30px] leading-none">sell</span>
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
        <a class="group block rounded-[28px] border border-transparent bg-surface-container-lowest p-5 md:p-6 shadow-[0_20px_50px_rgba(26,28,27,0.03)] transition-all duration-300 hover:translate-x-2 hover:border-outline-variant/30" href="/community/post/${post.id}">
          <div class="flex items-start md:items-center gap-4 md:gap-6">
            <div class="flex-shrink-0">${categoryPreview(post.category)}</div>
            <div class="min-w-0 flex-1">
              ${categoryBadge(post.category)}
              <h2 class="mt-3 text-xl md:text-2xl font-headline text-on-surface leading-snug"><span class="group-hover:text-primary transition-colors">${post.title}</span></h2>
              <p class="mt-2 text-sm md:text-[15px] text-outline leading-relaxed">${post.excerpt}</p>
              <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-widest text-outline">
                <span>${post.author}</span>
                <span>${post.date}</span>
                <span>조회 ${post.views}</span>
                <span>댓글 ${post.comments}</span>
              </div>
            </div>
            <div class="hidden md:flex items-center gap-5 pl-4 text-outline">
              <div class="flex flex-col items-center min-w-[52px]">
                <span class="material-symbols-outlined text-[20px]">visibility</span>
                <span class="mt-1 text-[10px] font-label tracking-[0.2em] uppercase">${post.views}</span>
              </div>
              <div class="flex flex-col items-center min-w-[52px]">
                <span class="material-symbols-outlined text-[20px]">chat_bubble</span>
                <span class="mt-1 text-[10px] font-label tracking-[0.2em] uppercase">${post.comments}</span>
              </div>
              <span class="material-symbols-outlined text-primary text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_outward</span>
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
