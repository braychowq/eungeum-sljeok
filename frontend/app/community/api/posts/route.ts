import { createCommunityPost, type CommunityCategory, communityPosts } from '../../../../lib/community-posts';

export const runtime = 'nodejs';

function isCategory(value: string): value is CommunityCategory {
  return value === 'free' || value === 'qa' || value === 'market';
}

function normalizeCategory(value: unknown): CommunityCategory | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'free' || normalized === '아무말') {
    return 'free';
  }

  if (normalized === 'qa' || normalized === 'q/a') {
    return 'qa';
  }

  if (normalized === 'market' || normalized === '장터') {
    return 'market';
  }

  return null;
}

export async function GET() {
  return Response.json(communityPosts);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== 'object') {
    return Response.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const author =
    typeof payload.author === 'string' && payload.author.trim() ? payload.author.trim() : '익명 메이커';
  const category = normalizeCategory(payload.category);
  const imageNames = Array.isArray(payload.imageNames)
    ? payload.imageNames.filter(
        (item: unknown): item is string => typeof item === 'string' && item.trim().length > 0
      )
    : [];

  if (!title || !body || !category || !isCategory(category)) {
    return Response.json(
      { message: '카테고리, 제목, 내용을 모두 입력해주세요.' },
      { status: 400 }
    );
  }

  const post = createCommunityPost({
    author,
    body,
    category,
    title,
    imageNames
  });

  return Response.json({
    id: post.id,
    message: '게시물이 등록되었습니다.',
    status: 'created'
  });
}
