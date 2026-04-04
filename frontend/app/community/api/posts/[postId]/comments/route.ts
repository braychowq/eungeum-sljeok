import { addCommunityComment } from '../../../../../../lib/community-posts';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const segments = new URL(request.url).pathname.split('/').filter(Boolean);
  const rawPostId = segments.at(-2) ?? '';
  const postId = decodeURIComponent(rawPostId);
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== 'object') {
    return Response.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const author = typeof payload.author === 'string' ? payload.author.trim() : '';

  if (!body) {
    return Response.json({ message: '댓글 내용을 입력해주세요.' }, { status: 400 });
  }

  const comment = addCommunityComment(postId, { author, body });

  if (!comment) {
    return Response.json({ message: '댓글 등록에 실패했습니다.' }, { status: 404 });
  }

  return Response.json({
    message: '댓글이 등록되었습니다.',
    status: 'created'
  });
}
