'use client';

import { useMemo, useState } from 'react';
import { CommunityCategory, CommunityPost } from './types';
import styles from './CommunitySection.module.css';

type CommunitySectionProps = {
  posts: CommunityPost[];
};

type HomeCommunityTab = 'all' | CommunityCategory;

const tabs: Array<{ id: HomeCommunityTab; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'qna', label: 'Q&A' },
  { id: 'share', label: '공유' },
  { id: 'free', label: '아무말' }
];

export default function CommunitySection({ posts }: CommunitySectionProps) {
  const [activeTab, setActiveTab] = useState<HomeCommunityTab>('all');

  const filteredPosts = useMemo(
    () => (activeTab === 'all' ? posts : posts.filter((post) => post.category === activeTab)),
    [posts, activeTab]
  );

  return (
    <section id="community" className={styles.section} aria-label="커뮤니티">
      <div className={styles.headerRow}>
        <h3>슬쩍 얘기하기</h3>
      </div>

      <div className={styles.tabRow} role="tablist" aria-label="커뮤니티 카테고리">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTab}
            className={`${styles.tab} ${tab.id === activeTab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className={styles.list}>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <a href={post.href}>{post.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
