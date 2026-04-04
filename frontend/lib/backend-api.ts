type ApiEnvelope<T> = {
  status: 'ok' | 'error';
  data: T;
  message?: string | null;
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
  contact: string;
  capacity: number;
  imageUrls: string[];
  amenities: string[];
  createdAt: string;
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
  author: string;
  date: string;
  views: number;
  comments: number;
  commentList: CommunityComment[];
  relatedPosts: CommunityPostSummary[];
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

async function backendJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendBaseUrl}${path}`, {
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload || payload.status !== 'ok') {
    throw new Error(
      (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
        '서버 응답을 불러오지 못했습니다.'
    );
  }

  return payload.data;
}

export async function fetchStudios(limit?: number) {
  const qs = typeof limit === 'number' ? `?limit=${limit}` : '';
  return backendJson<{ items: StudioSummary[] }>(`/api/studios${qs}`);
}

export async function fetchStudioDetail(slug: string) {
  return backendJson<StudioDetail>(`/api/studios/${encodeURIComponent(slug)}`);
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
