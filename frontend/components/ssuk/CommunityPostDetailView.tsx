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
  share: '공유 아카이브',
  free: '메이커 라운지'
};

const categorySummaryMap: Record<DetailPost['category'], string> = {
  qna: '실패율을 줄이는 기준을 빠르게 맞춰보는 질문 노트입니다.',
  share: '작업 흐름에 바로 가져다 쓸 수 있는 실전 템플릿과 공유 기록입니다.',
  free: '메이커 사이의 호흡과 분위기를 가볍게 나누는 라운지 대화입니다.'
};

const sampleComments = [
  {
    id: 'c-1',
    author: '실버초보',
    time: '12분 전',
    text: '토치 각도 고정이 핵심이더라고요. 저도 같은 문제 있었어요.'
  },
  {
    id: 'c-2',
    author: '공방운영자',
    time: '6분 전',
    text: '피클링 이후 중화 과정까지 체크하면 표면 안정성이 좋아졌습니다.'
  }
];

export default function CommunityPostDetailView({ postId }: CommunityPostDetailViewProps) {
  const post = detailPostMap[postId] ?? fallbackPost;
  const listHref = `/community?tab=${post.category}`;
  const postsInCategory = communityPosts[post.category];
  const currentIndex = postsInCategory.findIndex((item) => item.id === post.id);
  const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
  const previousPost = resolvedIndex > 0 ? postsInCategory[resolvedIndex - 1] : null;
  const nextPost =
    resolvedIndex < postsInCategory.length - 1 ? postsInCategory[resolvedIndex + 1] : null;
  const makerBrief = [
    { label: '난이도', value: post.difficulty },
    { label: '예상 시간', value: post.duration },
    { label: '안전 메모', value: post.safetyNote }
  ];
  const resources = [
    { label: '재료', items: post.materials },
    { label: '도구', items: post.tools }
  ];
  const storyMetrics = [
    { label: '조회', value: post.viewCount },
    { label: '좋아요', value: post.likeCount },
    { label: '댓글', value: post.commentCount }
  ];
  const reactionButtons = [
    { id: 'like', label: '유용했어요', value: `${post.likeCount}` },
    { id: 'reply', label: '답변 이어가기', value: `${post.commentCount}` },
    { id: 'share', label: '메이커에게 공유', value: '링크' }
  ];
  const relatedPosts = [
    { id: 'previous', label: '이전 글', post: previousPost },
    { id: 'next', label: '다음 글', post: nextPost }
  ];

  return (
    <TwoMenuShell
      activeMenu="community"
      title="게시글 상세"
      subtitle="질문 내용, 댓글을 확인하고 의견을 남겨보세요"
      ctaLabel="← 목록으로"
      ctaHref={listHref}
      hideHero
    >
      <article className={styles.page} aria-label="게시글 상세">
        <section className={styles.heroSection} aria-label="게시글 헤더">
          <div className={styles.heroMain}>
            <div className={styles.badgeRow}>
              <span className={styles.categoryBadge}>{categoryLabelMap[post.category]}</span>
              <span className={styles.readingBadge}>Maker thread</span>
            </div>
            <h1>{post.title}</h1>
            <p className={styles.heroIntro}>{categorySummaryMap[post.category]}</p>

            <div className={styles.metaRow}>
              <span>{post.author}</span>
              <span>{post.createdAt}</span>
              <span>{categoryLabelMap[post.category]}</span>
            </div>

            <div className={styles.metricGrid}>
              {storyMetrics.map((metric) => (
                <article key={metric.label} className={styles.metricCard}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                  <strong className={styles.metricValue}>{metric.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.heroAside} aria-label="글 요약">
            <span className={styles.panelEyebrow}>Conversation brief</span>
            <ul className={styles.briefList}>
              {makerBrief.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>

            <Link href={listHref} className={styles.backLink}>
              이 카테고리 목록으로 돌아가기
            </Link>
          </aside>
        </section>

        <section className={styles.storySection} aria-label="본문과 재료 요약">
          <div className={styles.storyMain}>
            <div className={styles.sectionLead}>
              <span className={styles.sectionEyebrow}>Story line</span>
              <h2>본문</h2>
              <p>질문이 생긴 맥락과 현재 시도한 기준값을 한 번에 읽을 수 있습니다.</p>
            </div>

            <div className={styles.paragraphs}>
              {post.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <aside className={styles.resourcePanel} aria-label="재료와 도구">
            {resources.map((group) => (
              <section key={group.label} className={styles.resourceGroup}>
                <span className={styles.resourceLabel}>{group.label}</span>
                <div className={styles.chipList}>
                  {group.items.map((item) => (
                    <span key={item} className={styles.chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}

            <section className={styles.notePanel} aria-label="안전 메모">
              <span className={styles.resourceLabel}>Safety note</span>
              <p>{post.safetyNote}</p>
            </section>
          </aside>
        </section>

        <section className={styles.actionSection} aria-label="게시글 반응과 댓글">
          <div className={styles.sectionLead}>
            <span className={styles.sectionEyebrow}>Response dock</span>
            <h2>반응과 댓글을 한 흐름으로</h2>
            <p>공감 버튼과 한 줄 댓글 입력을 같은 도크에 묶어 바로 대화를 이어갈 수 있게 정리했습니다.</p>
          </div>

          <div className={styles.responseLayout}>
            <div className={styles.actionGrid}>
              {reactionButtons.map((action) => (
                <button key={action.id} type="button" className={styles.actionButton}>
                  <span>{action.value}</span>
                  <strong>{action.label}</strong>
                </button>
              ))}
            </div>

            <div className={styles.commentComposer}>
              <label className={styles.commentField}>
                <span>의견 남기기</span>
                <input type="text" placeholder="대화에 보탤 기준값이나 경험을 짧게 남겨보세요." />
              </label>
              <button type="button" className={styles.commentSubmit}>
                댓글 남기기
              </button>
            </div>
          </div>
        </section>

        <section className={styles.commentSection} aria-label="댓글">
          <div className={styles.sectionLead}>
            <span className={styles.sectionEyebrow}>Maker replies</span>
            <h2>댓글 {post.commentCount}</h2>
            <p>지금 이어지는 대화 흐름과 실전 피드백을 빠르게 훑어볼 수 있습니다.</p>
          </div>

          <ul className={styles.commentList}>
            {sampleComments.map((comment) => (
              <li key={comment.id} className={styles.commentCard}>
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
          <div className={styles.sectionLead}>
            <span className={styles.sectionEyebrow}>Continue reading</span>
            <h2>이전/다음 게시글</h2>
            <p>같은 카테고리의 흐름을 끊지 않고 이어서 읽을 수 있도록 정리했습니다.</p>
          </div>

          <div className={styles.relatedGrid}>
            {relatedPosts.map((item) => (
              <article key={item.id} className={styles.relatedCard}>
                <span className={styles.relatedLabel}>{item.label}</span>
                {item.post ? (
                  <Link href={item.post.href}>{item.post.title}</Link>
                ) : (
                  <p className={styles.relatedEmpty}>연결할 게시글이 없습니다.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </article>
    </TwoMenuShell>
  );
}
