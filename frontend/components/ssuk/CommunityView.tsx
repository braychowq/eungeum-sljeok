import Link from 'next/link';
import { communityPosts, communityTabs, type CommunityTabId } from './mockData';
import TwoMenuShell from './TwoMenuShell';
import styles from './CommunityView.module.css';

type CommunityViewProps = {
  activeTab: CommunityTabId;
};

export default function CommunityView({ activeTab }: CommunityViewProps) {
  const posts = communityPosts[activeTab];

  return (
    <TwoMenuShell
      activeMenu="community"
      title="슬쩍 커뮤니티"
      subtitle="Q&A / 공유 / 아무말 카테고리로 글 등록"
      ctaLabel="+ 글 등록"
      ctaHref="/community/new"
    >
      <section className={styles.tabSection} aria-label="커뮤니티 소카테고리">
        <h2 className={styles.sectionTitle}>Categories</h2>
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
      </section>

      <section className={styles.listSection} aria-label="게시글 목록">
        <h2 className={styles.sectionTitle}>All Posts</h2>
        <p className={styles.listLabel}>박스 구획 대신 간격/타이포로 구분한 리스트 스타일</p>
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
