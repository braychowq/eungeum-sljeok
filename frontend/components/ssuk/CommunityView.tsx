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

export default function CommunityView({ activeTab }: CommunityViewProps) {
  const posts = communityPosts[activeTab];
  const highlights = [...communityNotices, ...communityPopular];

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
                {tab.label}
              </Link>
            ))}
          </div>
          <Link href="/community/new" className={styles.writeButton}>
            글 등록
          </Link>
        </div>
      </section>

      <section className={styles.listSection} aria-label="게시글 목록">
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
