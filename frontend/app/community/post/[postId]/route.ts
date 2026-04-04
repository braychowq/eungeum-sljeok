import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { communityPosts, getCommunityPost } from '../../../../lib/community-posts';
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

export function GET(request: Request) {
  const rawPostId = new URL(request.url).pathname.split('/').pop() ?? '';
  const postId = decodeURIComponent(rawPostId);
  const post = getCommunityPost(postId);

  if (!post) {
    return new Response('Not Found', { status: 404 });
  }

  const templatePath = join(process.cwd(), 'stitch', 'community-post-detail.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  const relatedPosts = communityPosts.filter((item) => item.id !== post.id).slice(0, 2);
  const relatedHtml = relatedPosts
    .map(
      (item) => `
      <a class="block rounded-[1.5rem] bg-surface-container-lowest border border-outline-variant/20 p-6 hover:-translate-y-1 transition-transform" href="/community/post/${item.id}">
        <div class="mb-3">${categoryBadge(item.category)}</div>
        <h3 class="font-headline text-2xl text-on-surface leading-tight">${item.title}</h3>
        <p class="mt-4 text-sm text-on-surface-variant leading-relaxed">${item.excerpt}</p>
      </a>`
    )
    .join('');

  const html = finalizeStitchHtml(
    'community-post-detail',
    rawTemplate
      .replace('{{CATEGORY_BADGE}}', categoryBadge(post.category))
      .replaceAll('{{TITLE}}', post.title)
      .replace('{{EXCERPT}}', post.excerpt)
      .replace('{{AUTHOR}}', post.author)
      .replace('{{DATE}}', post.date)
      .replace('{{VIEWS}}', String(post.views))
      .replace('{{COMMENTS}}', String(post.comments))
      .replace('{{POST_ID}}', post.id)
      .replace(
        '{{BODY_HTML}}',
        post.content
          .map(
            (paragraph) =>
              `<p class="text-base md:text-lg leading-8 text-on-surface-variant">${paragraph}</p>`
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
                    <strong class="font-label text-[11px] uppercase tracking-[0.18em] text-on-surface">${comment.author}</strong>
                    <span class="text-[11px] uppercase tracking-[0.18em] text-outline">${comment.date}</span>
                  </div>
                  <p class="text-sm text-on-surface-variant leading-7">${comment.body}</p>
                </div>`
              )
              .join('')
          : `<div class="py-5 text-sm leading-7 text-on-surface-variant">아직 댓글이 없어요. 첫 댓글을 남겨보세요.</div>`
      )
      .replace('{{RELATED_POSTS}}', relatedHtml)
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
