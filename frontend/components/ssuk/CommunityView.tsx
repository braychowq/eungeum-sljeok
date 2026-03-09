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
      hideEyebrow
      hideCta
      ctaLabel="+ 글 등록"
      ctaHref="/community/new"
    >
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
