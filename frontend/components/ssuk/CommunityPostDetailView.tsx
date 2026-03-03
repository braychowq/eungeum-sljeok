import Link from 'next/link';
import TwoMenuShell from './TwoMenuShell';
import { communityPosts } from './mockData';
import styles from './CommunityPostDetailView.module.css';

type CommunityPostDetailViewProps = {
  postId: string;
};

type DetailPost = {
  id: string;
  category: 'qna' | 'share' | 'free';
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  summary: string;
  body: string[];
  materials: string[];
  tools: string[];
  difficulty: string;
  duration: string;
  safetyNote: string;
};

const detailPostMap: Record<string, DetailPost> = {
  'qna-1': {
    id: 'qna-1',
    category: 'qna',
    title: '은선 납땜 자국 줄이는 방법?',
    author: '익명의 작업자',
    createdAt: '2026-03-03 15:40',
    viewCount: 238,
    likeCount: 31,
    commentCount: 7,
    summary: '얇은 은선 연결부에서 생기는 검은 자국과 울퉁불퉁한 표면을 줄이는 팁이 필요해요.',
    body: [
      '0.7mm 은선을 원형으로 감아 반지를 만들고 있는데 납땜 후 자국이 생각보다 크게 남습니다.',
      '플럭스 양 조절, 버너 거리, 사포 단계(400-800-1200)는 적용했지만 마감이 일정하지 않아요.',
      '동일한 작업을 반복할 때 실패율을 줄일 수 있는 기준값을 알고 싶습니다.'
    ],
    materials: ['실버 와이어 0.7mm', '실버 솔더 하드', '붕사 플럭스'],
    tools: ['부탄 토치', '피클링 용액', '줄/사포 세트'],
    difficulty: '초급-중급',
    duration: '약 1시간 20분',
    safetyNote: '피클링 사용 시 고무장갑 필수, 환기 후 작업 권장'
  },
  'share-1': {
    id: 'share-1',
    category: 'share',
    title: '초보 제작자 체크리스트 템플릿',
    author: '작업 공유러',
    createdAt: '2026-03-03 14:22',
    viewCount: 412,
    likeCount: 56,
    commentCount: 12,
    summary: '작업 전/중/후 확인할 항목을 한 장으로 정리한 템플릿입니다.',
    body: [
      '재료 준비, 공구 점검, 안전 확인, 촬영 체크까지 한 번에 관리할 수 있는 양식을 만들었습니다.',
      'A4 출력용과 모바일 체크리스트 버전을 같이 공유합니다.',
      '필요하면 공방 규모에 맞게 항목을 줄이거나 추가해 사용하세요.'
    ],
    materials: ['출력용 체크리스트 PDF', '작업 기록 노트'],
    tools: ['태블릿/모바일', '프린터(선택)'],
    difficulty: '입문',
    duration: '준비 10분',
    safetyNote: '점검 항목 내 안전 파트(화재/환기/보호장비)는 필수 유지'
  },
  'free-1': {
    id: 'free-1',
    category: 'free',
    title: '오늘 작업하다가 제일 웃겼던 순간',
    author: '은금슬쩍 멤버',
    createdAt: '2026-03-03 13:51',
    viewCount: 129,
    likeCount: 22,
    commentCount: 9,
    summary: '작업실에서 생긴 소소한 해프닝을 공유해요.',
    body: [
      '줄질하다가 집중해서 시간을 봤더니 2시간이 순삭이었네요.',
      '다들 작업할 때 공감되는 웃긴 순간 있으면 댓글로 남겨주세요.',
      '오늘도 안전하게 작업 마무리합시다.'
    ],
    materials: ['자유 주제'],
    tools: ['자유'],
    difficulty: '무관',
    duration: '짧은 공유',
    safetyNote: '유머 글이어도 안전 수칙은 항상 우선!'
  }
};

const fallbackPost = detailPostMap['qna-1'];

const categoryLabelMap: Record<DetailPost['category'], string> = {
  qna: 'Q&A',
  share: '공유',
  free: '아무말'
};

const sampleComments = [
  { id: 'c-1', author: '실버초보', time: '12분 전', text: '토치 각도 고정이 핵심이더라고요. 저도 같은 문제 있었어요.' },
  { id: 'c-2', author: '공방운영자', time: '6분 전', text: '피클링 이후 중화 과정까지 체크하면 표면 안정성이 좋아졌습니다.' }
];

export default function CommunityPostDetailView({ postId }: CommunityPostDetailViewProps) {
  const post = detailPostMap[postId] ?? fallbackPost;
  const categoryLabel = categoryLabelMap[post.category];
  const listHref = `/community?tab=${post.category}`;
  const postsInCategory = communityPosts[post.category];
  const currentIndex = postsInCategory.findIndex((item) => item.id === post.id);
  const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
  const previousPost = resolvedIndex > 0 ? postsInCategory[resolvedIndex - 1] : null;
  const nextPost =
    resolvedIndex < postsInCategory.length - 1 ? postsInCategory[resolvedIndex + 1] : null;

  return (
    <TwoMenuShell
      activeMenu="community"
      title="게시글 상세"
      subtitle="질문 내용, 댓글을 확인하고 의견을 남겨보세요"
      ctaLabel="← 목록으로"
      ctaHref={listHref}
      hideHero
    >
      <section className={styles.headerSection} aria-label="게시글 헤더">
        <p className={styles.breadcrumb}>슬쩍 커뮤니티 &gt; {categoryLabel}</p>
        <h2>{post.title}</h2>
        <div className={styles.metaRow}>
          <span>{post.author}</span>
          <span>{post.createdAt}</span>
          <span>조회 {post.viewCount}</span>
          <span>좋아요 {post.likeCount}</span>
        </div>
      </section>

      <section className={styles.summarySection} aria-label="요약">
        <h3>요약</h3>
        <p>{post.summary}</p>
      </section>

      <section className={styles.bodySection} aria-label="본문">
        <h3>본문</h3>
        <div className={styles.paragraphs}>
          {post.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className={styles.actionSection} aria-label="게시글 반응">
        <button type="button">좋아요 {post.likeCount}</button>
        <button type="button">댓글 {post.commentCount}</button>
        <button type="button">공유</button>
      </section>

      <section className={styles.commentSection} aria-label="댓글">
        <h3>댓글 {post.commentCount}</h3>
        <div className={styles.commentInput}>
          <input type="text" placeholder="댓글을 입력해 주세요." />
          <button type="button">등록</button>
        </div>
        <ul className={styles.commentList}>
          {sampleComments.map((comment) => (
            <li key={comment.id}>
              <div className={styles.commentMeta}>
                <strong>{comment.author}</strong>
                <span>{comment.time}</span>
              </div>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.relatedSection} aria-label="앞뒤 게시글">
        <h3>이전/다음 게시글</h3>
        <ul className={styles.postNavList}>
          <li className={styles.postNavItem}>
            <span className={styles.postNavLabel}>이전 글</span>
            {previousPost ? (
              <Link href={previousPost.href}>{previousPost.title}</Link>
            ) : (
              <span className={styles.postNavEmpty}>이전 글이 없습니다.</span>
            )}
          </li>
          <li className={styles.postNavItem}>
            <span className={styles.postNavLabel}>다음 글</span>
            {nextPost ? (
              <Link href={nextPost.href}>{nextPost.title}</Link>
            ) : (
              <span className={styles.postNavEmpty}>다음 글이 없습니다.</span>
            )}
          </li>
        </ul>
      </section>
    </TwoMenuShell>
  );
}
