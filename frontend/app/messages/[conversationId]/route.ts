import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  escapeHtml,
  fetchAuthState,
  fetchConversationDetail,
  type ConversationMessage
} from '../../../lib/backend-api';
import { finalizeStitchHtml } from '../../../lib/stitch-html';

export const runtime = 'nodejs';

function renderBubble(message: ConversationMessage, currentUserId?: string | null) {
  const isMine = Boolean(currentUserId && message.senderId === currentUserId);
  const wrapperClass = isMine ? 'flex justify-end' : 'flex justify-start';
  const bubbleClass = isMine
    ? 'max-w-[78%] rounded-[1.5rem] rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-white shadow-[0_12px_30px_rgba(115,92,0,0.16)]'
    : 'max-w-[78%] rounded-[1.5rem] rounded-bl-md bg-white px-4 py-3 text-sm leading-6 text-on-surface shadow-[0_10px_24px_rgba(26,28,27,0.06)]';
  const metaClass = isMine
    ? 'mt-1 text-right text-[11px] text-white/75'
    : 'mt-1 text-left text-[11px] text-outline';

  return `
    <div class="${wrapperClass}" data-chat-item="" data-sender-id="${escapeHtml(message.senderId)}">
      <div>
        <div class="${bubbleClass}">${escapeHtml(message.content).replaceAll('\n', '<br/>')}</div>
        <div class="${metaClass}">${escapeHtml(message.timestamp)}</div>
      </div>
    </div>`;
}

function renderBubbles(messages: ConversationMessage[], currentUserId?: string | null) {
  if (!messages.length) {
    return `
      <div class="flex min-h-[44vh] items-center justify-center" data-empty-chat="">
        <p class="text-sm text-on-surface-variant">첫 말을 남겨보세요.</p>
      </div>`;
  }

  return messages.map((message) => renderBubble(message, currentUserId)).join('');
}

function notFoundResponse() {
  return new Response(
    `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>대화를 찾을 수 없어요</title><script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen bg-[#faf9f6] text-[#2f3430] flex items-center justify-center px-6">
  <main class="max-w-xl text-center rounded-[2rem] bg-white shadow-[0_30px_70px_rgba(26,28,27,0.05)] px-8 py-12">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#7f7663] mb-4">메시지</p>
    <h1 class="text-3xl md:text-4xl font-serif mb-4">대화를 찾을 수 없어요</h1>
    <p class="text-sm leading-7 text-[#4d4635]">지금은 열 수 없는 대화예요.</p>
    <a href="/messages" class="inline-flex items-center justify-center mt-8 rounded-full bg-[#735c00] px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white">목록으로 가기</a>
  </main>
</body></html>`,
    {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    }
  );
}

export async function GET(request: Request) {
  const rawConversationId = new URL(request.url).pathname.split('/').pop() ?? '';
  const conversationId = decodeURIComponent(rawConversationId);
  const cookieHeader = request.headers.get('cookie') ?? undefined;
  const templatePath = join(process.cwd(), 'stitch', 'messages-room.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  try {
    const authState = await fetchAuthState(cookieHeader);
    const currentUserId = authState.authenticated ? authState.user?.id ?? '' : '';

    if (!authState.authenticated) {
      const html = finalizeStitchHtml(
        'messages-room',
        rawTemplate
          .replaceAll('{{WORKSHOP_NAME}}', '대화')
          .replace('{{CONVERSATION_ID}}', escapeHtml(conversationId))
          .replace('{{CURRENT_USER_ID}}', '')
          .replace('{{MESSAGE_BUBBLES}}', '')
      );

      return new Response(html, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store'
        }
      });
    }

    const conversation = await fetchConversationDetail(conversationId, cookieHeader);
    const html = finalizeStitchHtml(
      'messages-room',
      rawTemplate
        .replaceAll('{{WORKSHOP_NAME}}', escapeHtml(conversation.workshopName))
        .replace('{{CONVERSATION_ID}}', escapeHtml(conversation.id))
        .replace('{{CURRENT_USER_ID}}', escapeHtml(currentUserId))
        .replace('{{MESSAGE_BUBBLES}}', renderBubbles(conversation.messages, currentUserId))
    );

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  } catch {
    return notFoundResponse();
  }
}
