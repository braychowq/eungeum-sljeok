import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  escapeHtml,
  fetchConversationDetail,
  isBackendApiError,
  type ConversationMessage
} from '../../../lib/backend-api';
import { renderStatusPage, requireAuthenticatedPage } from '../../../lib/page-guards';
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
    <div class="${wrapperClass}" data-chat-item="" data-message-id="${escapeHtml(message.id)}" data-sender-id="${escapeHtml(message.senderId)}">
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

export async function GET(request: Request) {
  const rawConversationId = new URL(request.url).pathname.split('/').pop() ?? '';
  const conversationId = decodeURIComponent(rawConversationId);
  const guard = await requireAuthenticatedPage(request);
  if ('response' in guard) {
    return guard.response;
  }

  const cookieHeader = request.headers.get('cookie') ?? undefined;
  const templatePath = join(process.cwd(), 'stitch', 'messages-room.html');
  const rawTemplate = readFileSync(templatePath, 'utf8');

  try {
    const currentUserId = guard.authState.user?.id ?? '';
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
  } catch (error) {
    if (isBackendApiError(error) && error.status === 404) {
      return renderStatusPage({
        title: '은금슬쩍 | 대화를 찾을 수 없어요',
        eyebrow: '메시지',
        heading: '대화를 찾을 수 없어요',
        body: '지금은 열 수 없는 대화예요.',
        actionHref: '/messages',
        actionLabel: '목록으로 가기',
        status: 404
      });
    }

    if (isBackendApiError(error)) {
      return renderStatusPage({
        title: '은금슬쩍 | 대화를 불러오지 못했어요',
        eyebrow: '메시지',
        heading: '지금은 대화를 불러오지 못해요',
        body: error.message,
        actionHref: '/messages',
        actionLabel: '목록으로 가기',
        status: error.status >= 500 ? error.status : 503
      });
    }

    throw error;
  }
}
