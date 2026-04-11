type ApiEnvelope<T> = {
  status: 'ok' | 'error';
  data: T;
  message?: string | null;
};

export class BackendApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'BackendApiError';
  }
}

export type AuthState = {
  authenticated: boolean;
  user?: {
    id: string;
    displayName: string;
    role: 'USER' | 'ADMIN';
    status: string;
    onboardingCompleted: boolean;
    accountPath: string;
    requiresOnboarding: boolean;
  };
};

export type StudioSummary = {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  priceAmount: number;
  priceUnit: string;
  ownerDisplayName: string;
  imageUrls: string[];
  amenities: string[];
  createdAt: string;
};

export type StudioDetail = {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  description: string;
  priceAmount: number;
  priceUnit: string;
  ownerDisplayName: string;
  capacity: number;
  imageUrls: string[];
  amenities: string[];
  createdAt: string;
  viewerOwnsWorkshop: boolean;
};

export type CommunityPostSummary = {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  comments: number;
};

export type CommunityComment = {
  author: string;
  body: string;
  date: string;
};

export type CommunityPostDetail = {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrls: string[];
  authorUserId?: string | null;
  author: string;
  date: string;
  views: number;
  comments: number;
  commentList: CommunityComment[];
  relatedPosts: CommunityPostSummary[];
};

export type ConversationSummary = {
  id: string;
  workshopName: string;
  workshopSlug: string;
  lastMessagePreview: string;
  timestamp: string;
  imageUrl: string;
  unreadCount: number;
  detailPath: string;
};

export type ConversationMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export type ConversationDetail = {
  id: string;
  workshopName: string;
  workshopSlug: string;
  imageUrl: string;
  messages: ConversationMessage[];
};

const backendBaseUrl = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8081';

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function svgPlaceholderDataUrl(lines: string[], options?: { accent?: string; background?: string }) {
  const accent = options?.accent || '#735c00';
  const background = options?.background || '#f4f3f1';
  const safeLines = lines
    .filter(Boolean)
    .slice(0, 3)
    .map((line) => escapeHtml(line).slice(0, 40));
  const textBlocks = safeLines
    .map(
      (line, index) =>
        `<text x="56" y="${128 + index * 34}" fill="#2f3430" font-family="Inter, sans-serif" font-size="${
          index === 0 ? 28 : 18
        }" font-weight="${index === 0 ? 600 : 500}">${line}</text>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500" fill="none"><rect width="1200" height="1500" rx="48" fill="${background}"/><rect x="56" y="56" width="1088" height="1388" rx="40" fill="#ffffff"/><rect x="56" y="56" width="1088" height="220" rx="40" fill="${accent}" opacity="0.12"/><circle cx="1042" cy="152" r="54" fill="${accent}" opacity="0.14"/><circle cx="944" cy="180" r="24" fill="${accent}" opacity="0.18"/><text x="56" y="104" fill="${accent}" font-family="Inter, sans-serif" font-size="18" font-weight="700" letter-spacing="5">EUNGEUM SLJEOK</text>${textBlocks}</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function studioPlaceholderImage(studioName: string, location?: string) {
  return svgPlaceholderDataUrl(
    [studioName || '공방', location || '사진을 곧 준비할게요.', '이미지 준비 중'],
    { accent: '#735c00', background: '#f4f3f1' }
  );
}

export function avatarPlaceholderImage(label: string) {
  const initial = escapeHtml((label || '메이커').trim().slice(0, 1) || 'M');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" fill="none"><rect width="240" height="240" rx="120" fill="#f4f3f1"/><circle cx="120" cy="120" r="92" fill="#735c00" opacity="0.14"/><text x="120" y="142" text-anchor="middle" fill="#735c00" font-family="Inter, sans-serif" font-size="88" font-weight="700">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function backendJson<T>(path: string, cookieHeader?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${backendBaseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      cache: 'no-store'
    });
  } catch {
    throw new BackendApiError(503, '서버에 연결하지 못했어요.');
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload || payload.status !== 'ok') {
    throw new BackendApiError(
      response.status || 502,
      (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
        '서버 응답을 불러오지 못했습니다.'
    );
  }

  return payload.data;
}

export async function fetchAuthState(cookieHeader?: string): Promise<AuthState> {
  let response: Response;
  try {
    response = await fetch(`${backendBaseUrl}/api/auth/me`, {
      headers: {
        Accept: 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      cache: 'no-store'
    });
  } catch {
    throw new BackendApiError(503, '로그인 상태를 확인하지 못했어요.');
  }

  if (!response.ok) {
    throw new BackendApiError(response.status, '로그인 상태를 확인하지 못했어요.');
  }

  const payload = (await response.json().catch(() => null)) as AuthState | null;
  if (!payload || typeof payload !== 'object') {
    throw new BackendApiError(502, '로그인 상태를 확인하지 못했어요.');
  }
  return payload;
}

export async function fetchStudios(limit?: number) {
  const qs = typeof limit === 'number' ? `?limit=${limit}` : '';
  return backendJson<{ items: StudioSummary[] }>(`/api/studios${qs}`);
}

export async function fetchStudioDetail(slug: string) {
  return backendJson<StudioDetail>(`/api/studios/${encodeURIComponent(slug)}`);
}

export async function fetchStudioDetailForViewer(slug: string, cookieHeader?: string) {
  return backendJson<StudioDetail>(`/api/studios/${encodeURIComponent(slug)}`, cookieHeader);
}

export async function fetchCommunityPosts(params: {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  const qs = searchParams.toString();
  return backendJson<{
    items: CommunityPostSummary[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  }>(`/api/community/posts${qs ? `?${qs}` : ''}`);
}

export async function fetchCommunityPostDetail(slug: string) {
  return backendJson<CommunityPostDetail>(`/api/community/posts/${encodeURIComponent(slug)}`);
}

export async function fetchConversations(cookieHeader?: string) {
  return backendJson<{ items: ConversationSummary[]; totalUnreadCount: number }>(
    '/api/conversations',
    cookieHeader
  );
}

export async function fetchConversationDetail(conversationId: string, cookieHeader?: string) {
  return backendJson<ConversationDetail>(
    `/api/conversations/${encodeURIComponent(conversationId)}/messages`,
    cookieHeader
  );
}

export async function fetchConversationUnreadCount(cookieHeader?: string) {
  return backendJson<{ count: number }>('/api/conversations/unread-count', cookieHeader);
}

export function isBackendApiError(error: unknown): error is BackendApiError {
  return error instanceof BackendApiError;
}
