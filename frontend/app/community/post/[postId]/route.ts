import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  type AuthState,
  escapeHtml,
  fetchAuthState,
  fetchCommunityPostDetail,
  isBackendApiError,
  type CommunityPostSummary
} from '../../../../lib/backend-api';
import { renderStatusPage } from '../../../../lib/page-guards';
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
        수정하기
      </a>
      <button class="inline-flex items-center justify-center rounded-full border border-[#e5c9c2] bg-[#fff4f1] px-4 py-2 text-[10px] font-label uppercase tracking-[0.18em] text-[#8a3827] hover:bg-[#fde9e4] transition-colors" data-post-delete data-post-id="${slug}" type="button">
        삭제
      </button>
    </div>
    <p class="hidden mt-3 rounded-xl border px-4 py-3 text-sm" data-post-action-message></p>
  `;
}

function renderImageGallery(imageUrls: string[]) {
  if (!imageUrls.length) {
    return '';
  }

  return `
    <section class="mt-10 grid gap-4 md:grid-cols-[1.6fr_1fr]">
      <div class="overflow-hidden rounded-[1.6rem] bg-surface-container-low">
        <img alt="게시글 대표 이미지" class="h-full w-full object-cover" src="${escapeHtml(imageUrls[0])}"/>
      </div>
      <div class="grid gap-4">
        ${imageUrls
          .slice(1, 3)
          .map(
            (imageUrl, index) => `
            <div class="overflow-hidden rounded-[1.3rem] bg-surface-container-low">
              <img alt="게시글 이미지 ${index + 2}" class="h-full w-full object-cover" src="${escapeHtml(imageUrl)}"/>
            </div>`
          )
          .join('')}
      </div>
    </section>`;
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
        .replace('{{IMAGE_GALLERY}}', renderImageGallery(post.imageUrls))
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
            : `<div class="py-5 text-sm leading-7 text-on-surface-variant">아직 댓글이 없어요.</div>`
        )
        .replace('{{RELATED_POSTS}}', renderRelatedPosts(post.relatedPosts))
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
        title: '은금슬쩍 | 글을 찾을 수 없어요',
        eyebrow: '커뮤니티',
        heading: '글을 찾을 수 없어요',
        body: '지금은 보이지 않는 글이에요.',
        actionHref: '/community',
        actionLabel: '전체 글 보기',
        status: 404
      });
    }

    if (isBackendApiError(error)) {
      return renderStatusPage({
        title: '은금슬쩍 | 글을 불러오지 못했어요',
        eyebrow: '커뮤니티',
        heading: '지금은 글을 불러오지 못해요',
        body: error.message,
        actionHref: '/community',
        actionLabel: '전체 글 보기',
        status: error.status >= 500 ? error.status : 503
      });
    }

    throw error;
  }
}
