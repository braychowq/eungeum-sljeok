import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml, fetchConversations, type ConversationSummary } from '../../lib/backend-api';
import { requireAuthenticatedPage } from '../../lib/page-guards';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

function renderConversationItems(items: ConversationSummary[]) {
  return items
    .map((conversation) => {
      const imageUrl = conversation.imageUrl || '';
      const unreadBadge =
        conversation.unreadCount > 0
          ? `<span class="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-1 text-[11px] font-semibold leading-none text-white">${conversation.unreadCount}</span>`
          : '';
      return `
      <a class="group flex items-center gap-4 rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-4 py-4 transition-all hover:border-primary/20 hover:shadow-[0_16px_40px_rgba(26,28,27,0.05)]" data-conversation-item="" data-workshop-slug="${escapeHtml(conversation.workshopSlug)}" href="${conversation.detailPath}">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low">
          ${
            imageUrl
              ? `<img alt="${escapeHtml(conversation.workshopName)}" class="h-full w-full object-cover" src="${escapeHtml(imageUrl)}"/>`
              : `<div class="flex h-full w-full items-center justify-center text-outline"><span class="material-symbols-outlined">forum</span></div>`
          }
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex items-center gap-2">
              <h2 class="truncate text-base font-medium text-on-surface">${escapeHtml(conversation.workshopName)}</h2>
              ${unreadBadge}
            </div>
            <span class="shrink-0 text-xs text-outline">${escapeHtml(conversation.timestamp)}</span>
          </div>
          <p class="mt-1 truncate text-sm ${conversation.unreadCount > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">${escapeHtml(conversation.lastMessagePreview)}</p>
        </div>
      </a>`;
    })
    .join('');
}

export async function GET(request: Request) {
  const guard = await requireAuthenticatedPage(request);
  if ('response' in guard) {
    return guard.response;
  }

  const templatePath = join(process.cwd(), 'stitch', 'messages.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');
  const cookieHeader = request.headers.get('cookie') ?? undefined;

  let items: ConversationSummary[] = [];
  let fetchMessage = '';

  try {
    const payload = await fetchConversations(cookieHeader);
    items = payload.items;
  } catch {
    items = [];
    fetchMessage =
      'mb-4 rounded-2xl border border-[#f0d4cd] bg-[#fff4f1] px-5 py-4 text-sm text-[#8a3827]';
  }

  const html = finalizeStitchHtml(
    'messages',
    rawTemplate
      .replace(
        'class="hidden mb-4 rounded-2xl border px-5 py-4 text-sm" data-inbox-message=""></div>',
        fetchMessage
          ? `<div class="${fetchMessage}" data-inbox-message="">지금은 대화를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</div>`
          : '<div class="hidden mb-4 rounded-2xl border px-5 py-4 text-sm" data-inbox-message=""></div>'
      )
      .replace('{{CONVERSATION_ITEMS}}', renderConversationItems(items))
      .replace(
        '{{MESSAGES_EMPTY_CLASS}}',
        items.length > 0 || Boolean(fetchMessage)
          ? 'hidden rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-6 py-10 text-center text-on-surface-variant'
          : 'rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-6 py-10 text-center text-on-surface-variant'
      )
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
