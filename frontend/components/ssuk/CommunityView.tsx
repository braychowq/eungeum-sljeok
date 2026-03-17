import Link from 'next/link';
import EditorialSelectionDeck from '../common/EditorialSelectionDeck';
import ProductEditorialCard from '../common/ProductEditorialCard';
import ProductFeatureBand from '../common/ProductFeatureBand';
import { ProductLink } from '../common/ProductControl';
import ProductSectionHeader from '../common/ProductSectionHeader';
import ProductStatGrid, { type ProductStatGridItem } from '../common/ProductStatGrid';
import {
  communityNotices,
  communityPopular,
  communityPosts,
  communityTabs,
  type CommunityTabId
} from './mockData';
import TwoMenuShell from './TwoMenuShell';
import styles from './CommunityView.module.css';

type CommunityViewProps = {
  activeTab: CommunityTabId;
};

const communityTabDescription: Record<CommunityTabId, string> = {
  qna: '막히는 작업과 재료 고민을 빠르게 묻고 답하는 공간',
  share: '거래처, 자료, 운영 팁처럼 바로 써먹을 정보를 모아보는 공간',
  free: '작업 근황과 가벼운 이야기를 편하게 나누는 공간'
};

const communityComposeGuide: Record<
  CommunityTabId,
  { title: string; description: string; prompts: string[]; ctaLabel: string }
> = {
  qna: {
    title: '막히는 공정이나 재료 고민을 바로 물어보세요.',
    description: '지금 작업 중인 문제를 짧게 정리해 올리면 비슷한 경험을 가진 메이커가 빠르게 답해줄 수 있어요.',
    prompts: ['납땜', '도금', '도구 추천'],
    ctaLabel: '질문 올리기'
  },
  share: {
    title: '바로 써먹을 자료와 운영 팁을 남겨보세요.',
    description: '거래처, 가격표, 계약 팁처럼 다른 작업자에게 도움이 되는 실무 자료를 공유하기 좋은 흐름입니다.',
    prompts: ['거래처', '원가표', '운영 팁'],
    ctaLabel: '정보 공유하기'
  },
  free: {
    title: '오늘 작업 근황이나 가벼운 이야기를 남겨보세요.',
    description: '최근 작업 로그, 시장 후기, 집중 안 되는 날의 잡담까지 편하게 이어갈 수 있는 대화 흐름입니다.',
    prompts: ['작업 근황', '시장 후기', '잡담'],
    ctaLabel: '이야기 남기기'
  }
};

const feedLaneLabels = ['Opening', 'Quick Catch-up', 'Practical Note', 'Save for Later', 'Browse More', 'Keep Reading'];

const feedLaneDescriptions: Record<CommunityTabId, string[]> = {
  qna: [
    '작업 막힘을 가장 빠르게 풀기 좋은 첫 질문입니다.',
    '비슷한 공정 이슈를 바로 따라잡기 좋은 흐름입니다.',
    '실무에 바로 옮길 수 있는 체크 포인트가 이어집니다.',
    '작업 끝나고 저장해두기 좋은 참고 대화입니다.',
    '도구와 재료 선택에서 자주 반복되는 질문입니다.',
    '시간 날 때 이어 읽기 좋은 보조 흐름입니다.'
  ],
  share: [
    '실무 자료를 바로 가져다 쓰기 좋은 공유 글입니다.',
    '가격표나 거래처처럼 저장 가치가 큰 정보가 이어집니다.',
    '운영 기준을 다듬을 때 참고하기 좋은 포인트입니다.',
    '사진, 판매, 계약처럼 제작 외 영역까지 넓혀볼 수 있습니다.',
    '당장 필요하지 않아도 북마크해두기 좋은 대화입니다.',
    '이후 흐름을 따라가며 천천히 읽어볼 만한 글입니다.'
  ],
  free: [
    '오늘 분위기를 가장 잘 보여주는 가벼운 첫 대화입니다.',
    '작업자들의 최근 감정선과 근황을 빠르게 확인할 수 있습니다.',
    '공감과 반응이 많은 이야기가 이어지는 구간입니다.',
    '쉬는 시간에 읽기 좋은 가벼운 흐름입니다.',
    '메이커들의 생활감이 묻어나는 일상형 대화입니다.',
    '천천히 훑어보며 커뮤니티 온도를 느끼기 좋은 글입니다.'
  ]
};

export default function CommunityView({ activeTab }: CommunityViewProps) {
  const posts = communityPosts[activeTab];
  const highlights = [...communityNotices, ...communityPopular];
  const [leadHighlight, ...secondaryHighlights] = highlights;
  const activeTabLabel = communityTabs.find((tab) => tab.id === activeTab)?.label ?? '커뮤니티';
  const activeLeadPost = posts[0];
  const latestMeta = posts[0]?.meta ?? '새 글이 곧 올라올 예정이에요.';
  const totalPostCount = Object.values(communityPosts).reduce((count, items) => count + items.length, 0);
  const composeGuide = communityComposeGuide[activeTab];
  const composeHref = `/community/new?tab=${activeTab}`;
  const tabFlowCards = communityTabs.map((tab) => {
    const tabPosts = communityPosts[tab.id];

    return {
      ...tab,
      count: tabPosts.length,
      latestPost: tabPosts[0],
      description: communityTabDescription[tab.id],
      isActive: tab.id === activeTab
    };
  });
  const overviewStats = [
    {
      label: '전체 대화',
      value: `${totalPostCount}개`,
      note: '질문, 실무 공유, 근황 로그가 한 화면에서 이어집니다.'
    },
    {
      label: '오늘 하이라이트',
      value: `${highlights.length}개`,
      note: '공지와 인기 글을 먼저 훑고 메인 대화로 들어갈 수 있습니다.'
    },
    {
      label: '현재 포커스',
      value: activeTabLabel,
      note: `${posts.length}개 글이 지금 이 흐름 안에서 살아 움직이고 있습니다.`
    }
  ];
  const overviewSignalCards: ProductStatGridItem[] = overviewStats.map((stat, index) => ({
    label: stat.label,
    value: stat.value,
    description: stat.note,
    emphasis: index === 1 ? 'warm' : index === 2 ? 'support' : 'default'
  }));
  const feedEntries = posts.map((post, index) => ({
    ...post,
    lane: feedLaneLabels[index] ?? 'Keep Reading',
    note:
      feedLaneDescriptions[activeTab][index] ??
      '메이커들의 최근 흐름을 빠르게 따라잡기 좋은 대화입니다.'
  }));
  const heroLeadHref = activeLeadPost?.href ?? composeHref;
  const heroLeadTitle = activeLeadPost?.title ?? composeGuide.title;
  const heroLeadDescription = activeLeadPost
    ? `${composeGuide.description} 지금은 이 글이 가장 먼저 읽힙니다.`
    : `${activeTabLabel} 흐름의 첫 대화를 준비하고 있습니다.`;

  const selectionSignals = [
    {
      label: '현재 탭',
      value: activeTabLabel,
      detail: composeGuide.title
    },
    {
      label: '대화 개수',
      value: `${posts.length}개 글`,
      detail: `${activeTabLabel} 흐름`
    },
    {
      label: '키워드',
      value: composeGuide.prompts.join(' · '),
      detail: '자주 오가는 표현으로 맥락을 빠르게 파악할 수 있습니다.'
    }
  ];

  const selectionItems = communityTabs.map((tab) => ({
    id: tab.id,
    href: `/community?tab=${tab.id}`,
    eyebrow: 'Conversation mode',
    title: tab.label,
    description: communityTabDescription[tab.id],
    meta: `${communityPosts[tab.id].length}개 글`,
    badge: tab.id === activeTab ? '현재 흐름' : '이 흐름 보기',
    isActive: tab.id === activeTab
  }));

  return (
    <TwoMenuShell
      activeMenu="community"
      title="슬쩍 커뮤니티"
      hideHero
      hideEyebrow
      hideCta
      ctaLabel="+ 글 등록"
      ctaHref={composeHref}
    >
      <section className={styles.heroSection} aria-label="커뮤니티 소개">
        <ProductFeatureBand
          tone="warm"
          titleAs="h1"
          eyebrow="Maker Conversation"
          title="막히는 작업은 묻고, 쓸모 있는 정보는 바로 이어지는 대화 흐름"
          description={
            <>
              운영 공지와 인기 글을 먼저 훑은 뒤, 지금 필요한 방으로 들어가세요. 질문을 해결하고,
              실무 자료를 저장하고, 가벼운 작업 근황까지 같은 호흡으로 이어지는 커뮤니티입니다.
            </>
          }
          meta={
            <div className={styles.heroPills}>
              <span>공지 {communityNotices.length}</span>
              <span>인기 {communityPopular.length}</span>
              <span>{activeTabLabel} 집중 보기</span>
            </div>
          }
          action={
            <ProductLink
              href={composeHref}
              tone="warm"
              variant="primary"
              className={styles.heroPrimaryAction}
            >
              {composeGuide.ctaLabel}
            </ProductLink>
          }
          className={styles.heroBand}
          bodyClassName={styles.heroBandBody}
        >
          <ProductEditorialCard
            href={heroLeadHref}
            tone="warm"
            layout="text"
            badge="Start Here"
            eyebrow={`${activeTabLabel} 흐름`}
            heading={heroLeadTitle}
            description={heroLeadDescription}
            signals={
              <div className={styles.heroLeadSignals}>
                <span>{activeLeadPost?.meta ?? latestMeta}</span>
                <span>{composeGuide.prompts.join(' · ')}</span>
              </div>
            }
            footer={<span className={styles.heroLeadFooter}>지금 가장 먼저 읽을 대화</span>}
            className={styles.heroLeadCard}
          />

          <div className={styles.heroSideColumn}>
            <ProductStatGrid
              items={overviewSignalCards}
              columns={1}
              mobileColumns={1}
              size="sm"
              ariaLabel="커뮤니티 요약 신호"
              className={styles.heroStats}
            />

            <ProductEditorialCard
              as="div"
              tone="neutral"
              layout="text"
              badge="Write Cue"
              eyebrow={`${activeTabLabel}에서 이렇게 시작`}
              heading={composeGuide.title}
              description={composeGuide.description}
              signals={
                <div className={styles.heroComposeSignals}>
                  {composeGuide.prompts.map((prompt) => (
                    <span key={prompt}>{prompt}</span>
                  ))}
                </div>
              }
              footer={
                <div className={styles.heroComposeActions}>
                  <ProductLink
                    href={`/community?tab=${activeTab}`}
                    tone="warm"
                    variant="secondary"
                    className={styles.heroSecondaryAction}
                  >
                    {activeTabLabel} 둘러보기
                  </ProductLink>
                </div>
              }
              className={styles.heroComposeCard}
            />
          </div>
        </ProductFeatureBand>
      </section>

      <section className={styles.boardSection} aria-label="지금 확인할 글">
        <ProductSectionHeader
          tone="warm"
          eyebrow="Opening Board"
          title="지금 확인할 글"
          description="공지부터 인기 글까지 먼저 스캔한 뒤, 가장 반응이 큰 이야기에서 바로 대화 흐름을 잡을 수 있도록 재정리했습니다."
          compact
        />

        <div className={styles.boardLayout}>
          {leadHighlight ? (
            <Link href={leadHighlight.href} className={styles.boardLead}>
              <div className={styles.boardLeadTop}>
                <span
                  className={`${styles.boardBadge} ${
                    leadHighlight.kind === 'notice' ? styles.boardBadgeNotice : styles.boardBadgePopular
                  }`}
                >
                  {leadHighlight.kind === 'notice' ? '운영 공지' : '실시간 인기'}
                </span>
                <strong>{leadHighlight.title}</strong>
                <p>{leadHighlight.meta}</p>
              </div>
              <span className={styles.boardLeadAction}>먼저 읽고 흐름 잡기</span>
            </Link>
          ) : null}

          <div className={styles.boardColumn}>
            <ul className={styles.boardList}>
              {secondaryHighlights.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.boardItem}>
                    <div className={styles.boardItemTop}>
                      <span
                        className={`${styles.boardBadge} ${
                          item.kind === 'notice' ? styles.boardBadgeNotice : styles.boardBadgePopular
                        }`}
                      >
                        {item.kind === 'notice' ? '안내' : '인기'}
                      </span>
                      <span className={styles.boardItemMeta}>{item.meta}</span>
                    </div>
                    <strong>{item.title}</strong>
                  </Link>
                </li>
              ))}
            </ul>

            <aside className={styles.pulsePanel}>
              <div className={styles.pulseHeader}>
                <span className={styles.pulseEyebrow}>Today&apos;s Pulse</span>
                <strong>{activeTabLabel} 방에서 많이 오가는 키워드</strong>
                <p>{composeGuide.prompts.join(' · ')}</p>
              </div>
              <div className={styles.pulseChips}>
                {composeGuide.prompts.map((prompt) => (
                  <span key={prompt}>{prompt}</span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.roomsSection} aria-label="대화방 둘러보기">
        <ProductSectionHeader
          tone="warm"
          eyebrow="Conversation Atlas"
          title="대화방 둘러보기"
          description="방마다 다른 분위기를 한눈에 보고, 지금 필요한 곳으로 바로 옮겨갈 수 있도록 구조를 단순화했습니다."
          compact
        />

        <div className={styles.roomLayout}>
          <div className={styles.roomRail}>
            {tabFlowCards.map((tab) => (
              <Link
                key={tab.id}
                href={`/community?tab=${tab.id}`}
                className={`${styles.roomRailItem} ${tab.isActive ? styles.roomRailItemActive : ''}`}
                aria-current={tab.isActive ? 'page' : undefined}
              >
                <div className={styles.roomRailTop}>
                  <span className={styles.roomRailBadge}>{tab.label}</span>
                  <span className={styles.roomRailCount}>{tab.count}개</span>
                </div>
                <strong>{tab.description}</strong>
                <p>{tab.latestPost?.title ?? '새 글이 곧 올라올 예정이에요.'}</p>
                <span className={styles.roomRailMeta}>{tab.latestPost?.meta ?? '새 대화 준비 중'}</span>
              </Link>
            ))}
          </div>

          <aside className={styles.roomStage}>
            <span className={styles.roomStageEyebrow}>Now in {activeTabLabel}</span>
            <strong>{composeGuide.title}</strong>
            <p>{composeGuide.description}</p>
            <div className={styles.roomStageMeta}>
              <span>{posts.length}개 새 글</span>
              <span>{latestMeta}</span>
            </div>
            <div className={styles.roomStagePrompts}>
              {composeGuide.prompts.map((prompt) => (
                <span key={prompt}>{prompt}</span>
              ))}
            </div>
            {activeLeadPost ? (
              <Link href={activeLeadPost.href} className={styles.roomStageLink}>
                <span>지금 가장 먼저 볼 글</span>
                <strong>{activeLeadPost.title}</strong>
              </Link>
            ) : null}
            <div className={styles.roomStageActions}>
              <ProductLink
                href={composeHref}
                tone="warm"
                variant="primary"
                className={styles.roomPrimaryAction}
              >
                {composeGuide.ctaLabel}
              </ProductLink>
              <ProductLink
                href={`/community?tab=${activeTab}`}
                tone="warm"
                variant="secondary"
                className={styles.roomSecondaryAction}
              >
                {activeTabLabel} 둘러보기
              </ProductLink>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.feedSection} aria-label={`${activeTabLabel} 대화 흐름`}>
        <div className={styles.feedHeader}>
          <ProductSectionHeader
            tone="warm"
            eyebrow="Live Feed"
            title={`${activeTabLabel}에서 이어지는 대화 흐름`}
            description="관리자형 목록 대신, 가장 먼저 읽을 글과 이어서 따라갈 대화를 한 흐름으로 배치해 빠르게 맥락을 잡도록 바꿨습니다."
            compact
          />

          <div className={styles.feedControlCluster}>
            <EditorialSelectionDeck
              theme="warm"
              eyebrow="Conversation Picker"
              title={`지금 ${activeTabLabel} 흐름에서 이어볼 대화방을 고르세요`}
              description="탭을 단순 필터처럼 누르는 대신, 각 방의 성격과 최근 흐름을 먼저 읽고 지금 맞는 대화로 부드럽게 넘어가도록 다시 묶었습니다."
              signals={selectionSignals}
              items={selectionItems}
              action={{ href: composeHref, label: composeGuide.ctaLabel }}
              ariaLabel="커뮤니티 모드 선택"
            />
          </div>

        </div>

        <div className={styles.feedCanvas}>
          <article className={styles.feedLead}>
            <span className={styles.feedLeadEyebrow}>Start Here</span>
            <strong>{activeLeadPost?.title ?? '지금 읽을 첫 글을 준비 중입니다.'}</strong>
            <p>{communityTabDescription[activeTab]}</p>
            <div className={styles.feedLeadMeta}>
              <span>{latestMeta}</span>
              <span>현재 탭 {posts.length}개 글</span>
            </div>
            <div className={styles.feedLeadChips}>
              {composeGuide.prompts.map((prompt) => (
                <span key={prompt}>{prompt}</span>
              ))}
            </div>
          </article>

          <ol className={styles.feedTimeline}>
            {feedEntries.map((post, index) => (
              <li
                key={post.id}
                className={`${styles.feedItem} ${index === 0 ? styles.feedItemEmphasis : ''}`}
              >
                <span className={styles.feedMarker}>{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.feedBody}>
                  <span className={styles.feedLane}>{post.lane}</span>
                  <Link href={post.href} className={styles.feedLink}>
                    <strong>{post.title}</strong>
                  </Link>
                  <p>{post.note}</p>
                  <div className={styles.feedMetaRow}>
                    <span>{post.meta}</span>
                    {index === 0 ? <span className={styles.feedMetaBadge}>먼저 읽기</span> : null}
                  </div>
                </div>
                <ProductLink
                  href={post.href}
                  tone="warm"
                  variant="secondary"
                  size="sm"
                  className={styles.feedItemAction}
                >
                  대화 보기
                </ProductLink>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </TwoMenuShell>
  );
}
