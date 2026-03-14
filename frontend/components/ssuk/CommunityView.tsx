import Link from 'next/link';
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

export default function CommunityView({ activeTab }: CommunityViewProps) {
  const posts = communityPosts[activeTab];
  const highlights = [...communityNotices, ...communityPopular];
  const [leadHighlight, ...secondaryHighlights] = highlights;
  const activeTabLabel = communityTabs.find((tab) => tab.id === activeTab)?.label ?? '커뮤니티';
  const latestMeta = posts[0]?.meta ?? '새 글이 곧 올라올 예정이에요.';
  const totalPostCount = Object.values(communityPosts).reduce((count, items) => count + items.length, 0);
  const overviewStats = [
    { label: '전체 대화', value: `${totalPostCount}개` },
    { label: '지금 확인할 글', value: `${highlights.length}개` },
    { label: '현재 포커스', value: activeTabLabel }
  ];

  return (
    <TwoMenuShell
      activeMenu="community"
      title="슬쩍 커뮤니티"
      hideHero
      hideEyebrow
      hideCta
      ctaLabel="+ 글 등록"
      ctaHref="/community/new"
    >
      <section className={styles.overviewSection} aria-label="커뮤니티 소개">
        <div className={styles.overviewIntro}>
          <span className={styles.overviewEyebrow}>Community View</span>
          <h1 className={styles.overviewTitle}>작업 고민부터 운영 노하우까지, 지금 오가는 얘기</h1>
          <p className={styles.overviewDescription}>
            공지와 인기 대화를 먼저 훑고, 지금 필요한 탭으로 바로 들어가세요. 빠른 질문, 실무
            공유, 가벼운 작업 로그를 한 화면에서 이어서 탐색할 수 있습니다.
          </p>
          <div className={styles.overviewPills}>
            <span>공지 {communityNotices.length}</span>
            <span>인기 {communityPopular.length}</span>
            <span>{activeTabLabel} 집중 탐색</span>
          </div>
        </div>
        <div className={styles.overviewStats} aria-label="커뮤니티 요약 지표">
          {overviewStats.map((stat) => (
            <div key={stat.label} className={styles.overviewStatCard}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.highlightSection} aria-label="지금 확인할 글">
        <div className={styles.sectionIntro}>
          <div>
            <h2 className={styles.sectionTitle}>지금 확인할 글</h2>
            <p className={styles.sectionDescription}>
              공지부터 인기 글까지 먼저 보고, 대화 흐름이 가장 활발한 이야기로 바로 들어가세요.
            </p>
          </div>
        </div>

        <div className={styles.highlightGrid}>
          {leadHighlight ? (
            <a href={leadHighlight.href} className={styles.leadHighlight}>
              <span
                className={`${styles.highlightBadge} ${
                  leadHighlight.kind === 'notice' ? styles.highlightBadgeNotice : styles.highlightBadgePopular
                }`}
              >
                {leadHighlight.kind === 'notice' ? '공지' : '인기'}
              </span>
              <div className={styles.leadHighlightText}>
                <strong>{leadHighlight.title}</strong>
                <p>{leadHighlight.meta}</p>
              </div>
              <span className={styles.leadHighlightAction}>바로 보기</span>
            </a>
          ) : null}

          <ul className={styles.highlightList}>
            {secondaryHighlights.map((item) => (
              <li key={item.id}>
                <a href={item.href} className={styles.highlightItem}>
                  <span
                    className={`${styles.highlightBadge} ${
                      item.kind === 'notice' ? styles.highlightBadgeNotice : styles.highlightBadgePopular
                    }`}
                  >
                    {item.kind === 'notice' ? '공지' : '인기'}
                  </span>
                  <div className={styles.highlightText}>
                    <strong>{item.title}</strong>
                    <span className={styles.highlightMeta}>{item.meta}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.tabSection} aria-label="커뮤니티 소카테고리">
        <div className={styles.controlsRow}>
          <div className={styles.tabRow}>
            {communityTabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/community?tab=${tab.id}`}
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.tabButtonActive : ''
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span>{tab.label}</span>
                <span className={styles.tabCount}>{communityPosts[tab.id].length}</span>
              </Link>
            ))}
          </div>
          <Link href="/community/new" className={styles.writeButton}>
            글 등록
          </Link>
        </div>

        <div className={styles.activePanel}>
          <div className={styles.activePanelText}>
            <span className={styles.activeEyebrow}>현재 둘러보는 주제</span>
            <strong>{activeTabLabel}</strong>
            <p>{communityTabDescription[activeTab]}</p>
          </div>
          <div className={styles.activePanelMeta}>
            <span>{posts.length}개 글</span>
            <span>{latestMeta}</span>
          </div>
        </div>
      </section>

      <section className={styles.listSection} aria-label="게시글 목록">
        <div className={styles.sectionIntro}>
          <div>
            <h2 className={styles.sectionTitle}>{activeTabLabel} 최신 글</h2>
            <p className={styles.sectionDescription}>
              최근 올라온 대화를 훑어보고 필요한 글로 바로 이어지도록 목록 가독성을 높였습니다.
            </p>
          </div>
          <span className={styles.listSummary}>최근 대화 흐름을 빠르게 훑어보세요</span>
        </div>

        <ul className={styles.list}>
          {posts.map((post, index) => (
            <li key={post.id}>
              <a href={post.href} className={styles.listItem}>
                <div className={styles.listItemTop}>
                  <div className={styles.listItemText}>
                    <div className={styles.listItemFlags}>
                      {index === 0 ? <span className={styles.listFlagPrimary}>새 대화</span> : null}
                      {index < 3 ? <span className={styles.listFlagSecondary}>주목</span> : null}
                    </div>
                    <strong>{post.title}</strong>
                    <span>{post.meta}</span>
                  </div>
                  <span className={styles.listItemAction}>읽어보기</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TwoMenuShell>
  );
}
