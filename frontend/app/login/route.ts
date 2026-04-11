import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

const SAFE_MESSAGES: Record<string, string> = {
  social_login_failed: '다시 시도해 주세요.',
  auth_required: '로그인이 필요해요.',
  account_deleted: '탈퇴가 완료됐어요.'
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
  const providers: string[] = [];

  if (process.env.NAVER_CLIENT_ID) {
    providers.push(
      `<a class="flex items-center justify-between rounded-[1.35rem] border border-[#03c75a]/20 bg-[#03c75a] px-5 py-4 text-white transition-transform hover:scale-[0.995]" href="/api/auth/oauth/naver/start?next=${encodeURIComponent(
        next
      )}">
        <div>
          <div class="text-[10px] uppercase tracking-[0.18em] text-white/75">NAVER</div>
          <div class="mt-1.5 text-base font-semibold">네이버로 계속하기</div>
        </div>
        <div class="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center text-base font-semibold">N</div>
      </a>`
    );
  }

  if (process.env.KAKAO_CLIENT_ID) {
    providers.push(
      `<a class="flex items-center justify-between rounded-[1.35rem] border border-[#fee500]/40 bg-[#fee500] px-5 py-4 text-[#191600] transition-transform hover:scale-[0.995]" href="/api/auth/oauth/kakao/start?next=${encodeURIComponent(
        next
      )}">
        <div>
          <div class="text-[10px] uppercase tracking-[0.18em] text-[#191600]/70">KAKAO</div>
          <div class="mt-1.5 text-base font-semibold">카카오로 계속하기</div>
        </div>
        <div class="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
          <span class="material-symbols-outlined text-[22px]">chat</span>
        </div>
      </a>`
    );
  }

  const providerHtml = providers.length
    ? `<div class="space-y-4">${providers.join('')}</div>`
    : `<div class="rounded-[1.35rem] border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]">지금은 로그인 연동 설정을 확인하고 있어요. 잠시 후 다시 시도해 주세요.</div>`;

  const html = finalizeStitchHtml(
    'login',
    rawTemplate
      .replace('{{LOGIN_FEEDBACK}}', feedbackHtml)
      .replace('{{LOGIN_PROVIDER_BUTTONS}}', providerHtml)
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
