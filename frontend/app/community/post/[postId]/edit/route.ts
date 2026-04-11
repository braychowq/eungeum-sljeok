import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  type AuthState,
  escapeHtml,
  fetchAuthState,
  fetchCommunityPostDetail
} from '../../../../../lib/backend-api';
import { finalizeStitchHtml } from '../../../../../lib/stitch-html';

export const runtime = 'nodejs';

function checked(category: string, value: string) {
  return category === value ? 'checked' : '';
}

function forbiddenHtml() {
  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>권한이 없어요</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">커뮤니티</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">이 글은 수정할 수 없어요</h1>
    <p class="text-sm leading-7 text-[#4d4635]">작성한 사람만 다듬을 수 있어요.</p>
    <a href="/community" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">전체 글 보기</a>
  </main>
</body></html>`;
}

function notFoundHtml() {
  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>게시글을 찾을 수 없어요</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">커뮤니티</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">글을 찾을 수 없어요</h1>
    <p class="text-sm leading-7 text-[#4d4635]">지금은 보이지 않는 글이에요.</p>
    <a href="/community" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">전체 글 보기</a>
  </main>
</body></html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawPostId = url.pathname.split('/').slice(-2, -1)[0] ?? '';
  const postId = decodeURIComponent(rawPostId);
  const cookieHeader = request.headers.get('cookie') ?? undefined;
  const authState: AuthState = await fetchAuthState(cookieHeader).catch(
    () => ({ authenticated: false }) as AuthState
  );

  if (!authState.authenticated || !authState.user) {
    return Response.redirect(
      new URL(`/login?error=auth_required&next=${encodeURIComponent(`/community/post/${postId}/edit`)}`, request.url),
      302
    );
  }

  try {
    const post = await fetchCommunityPostDetail(postId);
    const canManage =
      authState.user.role === 'ADMIN' || authState.user.id === post.authorUserId;

    if (!canManage) {
      return new Response(forbiddenHtml(), {
        status: 403,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store'
        }
      });
    }

    const templatePath = join(process.cwd(), 'stitch', 'community-new.html');
    const rawTemplate = readFileSync(templatePath, 'utf8');
    const html = finalizeStitchHtml(
      'community-new',
      rawTemplate
        .replace(
          '<title>은금슬쩍 - 글쓰기</title>',
          '<title>은금슬쩍 - 글 수정</title>'
        )
        .replace('글쓰기', '글 수정')
        .replace(
          '남기고 싶은 이야기를 적어보세요.',
          '다듬고 싶은 부분만 고쳐주세요.'
        )
        .replace('data-community-form=""', `data-community-form="" data-submit-method="PUT" data-submit-url="/api/community/posts/${post.slug}" data-success-path="/community/post/${post.slug}" data-success-message="수정했어요." data-existing-image-urls='${escapeHtml(JSON.stringify(post.imageUrls || []))}'`)
        .replace('value="free"/>', `value="free" ${checked(post.category, 'free')}/>`)
        .replace('value="qa"/>', `value="qa" ${checked(post.category, 'qa')}/>`)
        .replace('value="market"/>', `value="market" ${checked(post.category, 'market')}/>`)
        .replace(
          'type="text"/>',
          `type="text" value="${escapeHtml(post.title)}"/>`
        )
        .replace(
          'placeholder="내용을 적어보세요" rows="8"></textarea>',
          `placeholder="내용을 적어보세요" rows="8">${escapeHtml(post.body)}</textarea>`
        )
        .replace('올리기', '저장하기')
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
