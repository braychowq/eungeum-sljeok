import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  type AuthState,
  escapeHtml,
  fetchAuthState,
  fetchCommunityPostDetail,
  type CommunityPostSummary
} from '../../../../lib/backend-api';
import { finalizeStitchHtml } from '../../../../lib/stitch-html';

export const runtime = 'nodejs';

function categoryBadge(category: string) {
  if (category === 'free') {
    return `<span class="inline-flex px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label uppercase tracking-[0.2em]">아무말</span>`;
  }

  if (category === 'qa') {
    return `<span class="inline-flex px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-[10px] font-label uppercase tracking-[0.2em]">Q/A</span>`;
  }

  return `<span class="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-label uppercase tracking-[0.2em]">장터</span>`;
}

function renderRelatedPosts(items: CommunityPostSummary[]) {
  return items
    .map(
      (item) => `
      <a class="block rounded-[1.5rem] bg-surface-container-lowest border border-outline-variant/20 p-6 hover:-translate-y-1 transition-transform" href="/community/post/${item.slug}">
        <div class="mb-3">${categoryBadge(item.category)}</div>
        <h3 class="font-headline text-2xl text-on-surface leading-tight">${escapeHtml(item.title)}</h3>
        <p class="mt-4 text-sm text-on-surface-variant leading-relaxed">${escapeHtml(item.excerpt)}</p>
      </a>`
    )
    .join('');
}

function renderOwnerActions(slug: string, canManage: boolean) {
  if (!canManage) {
    return '';
  }

  return `
    <div class="mt-5 flex flex-wrap items-center gap-3" data-owner-controls>
      <a class="inline-flex items-center justify-center rounded-full border border-outline-variant/30 px-4 py-2 text-[10px] font-label uppercase tracking-[0.18em] text-on-surface hover:border-primary hover:text-primary transition-colors" href="/community/post/${slug}/edit" data-post-edit>
        게시글 수정
      </a>
      <button class="inline-flex items-center justify-center rounded-full border border-[#e5c9c2] bg-[#fff4f1] px-4 py-2 text-[10px] font-label uppercase tracking-[0.18em] text-[#8a3827] hover:bg-[#fde9e4] transition-colors" data-post-delete data-post-id="${slug}" type="button">
        게시글 삭제
      </button>
    </div>
    <p class="hidden mt-3 rounded-xl border px-4 py-3 text-sm" data-post-action-message></p>
  `;
}

function notFoundHtml() {
  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>게시글을 찾을 수 없어요</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">Community</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">게시글을 찾을 수 없어요</h1>
    <p class="text-sm leading-7 text-[#4d4635]">삭제되었거나 잘못된 주소예요. 커뮤니티 목록으로 돌아가서 다른 글을 확인해보세요.</p>
    <a href="/community" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">커뮤니티로 이동</a>
  </main>
</body></html>`;
}

export async function GET(request: Request) {
  const rawPostId = new URL(request.url).pathname.split('/').pop() ?? '';
  const postId = decodeURIComponent(rawPostId);
  const templatePath = join(process.cwd(), 'stitch', 'community-post-detail.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  try {
    const cookieHeader = request.headers.get('cookie') ?? undefined;
    const [post, authState]: [Awaited<ReturnType<typeof fetchCommunityPostDetail>>, AuthState] = await Promise.all([
      fetchCommunityPostDetail(postId),
      fetchAuthState(cookieHeader).catch(() => ({ authenticated: false }) as AuthState)
    ]);
    const canManage = Boolean(
      authState.authenticated &&
        authState.user &&
        (authState.user.role === 'ADMIN' || authState.user.id === post.authorUserId)
    );

    const html = finalizeStitchHtml(
      'community-post-detail',
      rawTemplate
        .replace('{{CATEGORY_BADGE}}', categoryBadge(post.category))
        .replaceAll('{{TITLE}}', escapeHtml(post.title))
        .replace('{{EXCERPT}}', escapeHtml(post.excerpt))
        .replace('{{AUTHOR}}', escapeHtml(post.author))
        .replace('{{DATE}}', escapeHtml(post.date))
        .replace('{{VIEWS}}', String(post.views))
        .replace('{{COMMENTS}}', String(post.comments))
        .replace('{{OWNER_ACTIONS}}', renderOwnerActions(post.slug, canManage))
        .replace('{{POST_ID}}', post.slug)
        .replace(
          '{{BODY_HTML}}',
          post.body
            .split(/\n{2,}/)
            .filter(Boolean)
            .map(
              (paragraph) =>
                `<p class="text-base md:text-lg leading-8 text-on-surface-variant">${escapeHtml(
                  paragraph
                )}</p>`
            )
            .join('')
        )
        .replace(
          '{{COMMENT_ITEMS}}',
          post.commentList.length
            ? post.commentList
                .map(
                  (comment) => `
                  <div class="py-5 first:pt-0 last:pb-0">
                    <div class="flex items-center justify-between gap-4 mb-2">
                      <strong class="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface">${escapeHtml(comment.author)}</strong>
                      <span class="text-[11px] uppercase tracking-[0.18em] text-outline">${escapeHtml(comment.date)}</span>
                    </div>
                    <p class="text-sm text-on-surface-variant leading-7">${escapeHtml(comment.body)}</p>
                  </div>`
                )
                .join('')
            : `<div class="py-5 text-sm leading-7 text-on-surface-variant">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</div>`
        )
        .replace('{{RELATED_POSTS}}', renderRelatedPosts(post.relatedPosts))
    );

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  } catch {
    return new Response(notFoundHtml(), {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }
}
