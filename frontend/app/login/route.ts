import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

const SAFE_MESSAGES: Record<string, string> = {
  social_login_failed: '로그인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
  auth_required: '로그인 후 이용할 수 있는 페이지입니다.',
  account_deleted: '탈퇴가 처리되었습니다.'
};

function sanitizeNext(value: string | null) {
  if (!value) return '/';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return '/';
  }
  return trimmed;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const next = sanitizeNext(url.searchParams.get('next'));
  const errorMessage =
    SAFE_MESSAGES[url.searchParams.get('error') ?? ''] ||
    SAFE_MESSAGES[url.searchParams.get('message') ?? ''] ||
    '';

  const templatePath = join(process.cwd(), 'stitch', 'login.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  const feedbackHtml = errorMessage
    ? `<div class="mt-6 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]">${escapeHtml(errorMessage)}</div>`
    : '';

  const html = finalizeStitchHtml(
    'login',
    rawTemplate
      .replace('{{LOGIN_FEEDBACK}}', feedbackHtml)
      .replace(
        '{{NAVER_START_URL}}',
        `/api/auth/oauth/naver/start?next=${encodeURIComponent(next)}`
      )
      .replace(
        '{{KAKAO_START_URL}}',
        `/api/auth/oauth/kakao/start?next=${encodeURIComponent(next)}`
      )
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
