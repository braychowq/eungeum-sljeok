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
  const activeTabLabel = communityTabs.find((tab) => tab.id === activeTab)?.label ?? '커뮤니티';
  const latestMeta = posts[0]?.meta ?? '새 글이 곧 올라올 예정이에요.';

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
      <section className={styles.highlightSection} aria-label="지금 확인할 글">
        <div className={styles.highlightHeader}>
          <h2 className={styles.highlightTitle}>지금 확인할 글</h2>
        </div>
        <ul className={styles.highlightList}>
          {highlights.map((item) => (
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
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>{activeTabLabel} 최신 글</h2>
          <span className={styles.listSummary}>최근 대화 흐름을 빠르게 훑어보세요</span>
        </div>
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <a href={post.href} className={styles.listItem}>
                <strong>{post.title}</strong>
                <span>{post.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TwoMenuShell>
  );
}
