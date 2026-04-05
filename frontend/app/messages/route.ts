import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml, fetchConversations, type ConversationSummary } from '../../lib/backend-api';
import { finalizeStitchHtml } from '../../lib/stitch-html';

export const runtime = 'nodejs';

function renderConversationItems(items: ConversationSummary[]) {
  return items
    .map((conversation) => {
      const imageUrl = conversation.imageUrl || '';
      return `
      <a class="group flex items-center gap-4 rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-4 py-4 transition-all hover:border-primary/20 hover:shadow-[0_16px_40px_rgba(26,28,27,0.05)]" href="${conversation.detailPath}">
        <div class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface-container-low">
          ${
            imageUrl
              ? `<img alt="${escapeHtml(conversation.workshopName)}" class="h-full w-full object-cover" src="${escapeHtml(imageUrl)}"/>`
              : `<div class="flex h-full w-full items-center justify-center text-outline"><span class="material-symbols-outlined">forum</span></div>`
          }
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-3">
            <h2 class="truncate text-base font-medium text-on-surface">${escapeHtml(conversation.workshopName)}</h2>
            <span class="shrink-0 text-xs text-outline">${escapeHtml(conversation.timestamp)}</span>
          </div>
          <p class="mt-1 truncate text-sm text-on-surface-variant">${escapeHtml(conversation.lastMessagePreview)}</p>
        </div>
      </a>`;
    })
    .join('');
}

function renderEmptyState(hasItems: boolean) {
  if (hasItems) return '';

  return `
    <div class="rounded-[1.6rem] border border-outline-variant/15 bg-surface-container-lowest px-6 py-10 text-center text-on-surface-variant">
      <p class="font-headline text-2xl text-on-surface">아직 대화가 없어요</p>
      <p class="mt-2 text-sm">공방에서 가볍게 먼저 말을 걸어보세요.</p>
    </div>`;
}

export async function GET(request: Request) {
  const templatePath = join(process.cwd(), 'stitch', 'messages.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');
  const cookieHeader = request.headers.get('cookie') ?? undefined;

  let items: ConversationSummary[] = [];

  try {
    const payload = await fetchConversations(cookieHeader);
    items = payload.items;
  } catch {
    items = [];
  }

  const html = finalizeStitchHtml(
    'messages',
    rawTemplate
      .replace('{{CONVERSATION_ITEMS}}', renderConversationItems(items))
      .replace('{{MESSAGES_EMPTY_STATE}}', renderEmptyState(items.length > 0))
  );

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
