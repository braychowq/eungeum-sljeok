'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CommunityCategory, CommunityPost } from './types';
import styles from './CommunitySection.module.css';

type CommunitySectionProps = {
  posts: CommunityPost[];
};

const categoryLabelMap: Record<CommunityCategory, string> = {
  qna: 'Q&A',
  share: '공유',
  free: '아무말'
};

const POPULAR_POST_LIMIT = 5;
const POPULAR_WINDOW_HOURS = 24;

const getPopularityScore = (post: CommunityPost) =>
  post.likeCount * 3 + post.commentCount * 2 + post.viewCount * 0.1;

const isPopularCandidate = (post: CommunityPost) =>
  post.publishedHoursAgo <= POPULAR_WINDOW_HOURS && !post.isNotice && !post.isPinned;

const sortByPopularity = (a: CommunityPost, b: CommunityPost) => {
  const scoreDiff = getPopularityScore(b) - getPopularityScore(a);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  const latestDiff = a.publishedHoursAgo - b.publishedHoursAgo;

  if (latestDiff !== 0) {
    return latestDiff;
  }

  return b.likeCount - a.likeCount;
};

export default function CommunitySection({ posts }: CommunitySectionProps) {
  const popularPosts = useMemo(
    () =>
      posts
        .filter(isPopularCandidate)
        .sort(sortByPopularity)
        .slice(0, POPULAR_POST_LIMIT),
    [posts]
  );

  const visibleCategories = useMemo(
    () =>
      Array.from(new Set(popularPosts.map((post) => post.category))).map((category) => ({
        id: category,
        label: categoryLabelMap[category],
        href: `/community?tab=${category}`
      })),
    [popularPosts]
  );

  return (
    <section id="community" className={styles.section} aria-label="커뮤니티">
      <div className={styles.headerRow}>
        <div className={styles.headerBlock}>
          <span className={styles.eyebrow}>Community pulse</span>
          <h3 className={styles.heading}>
            <Link href="/community" className={styles.headerLink}>
              <span className={styles.headerTitle}>슬쩍 얘기하기</span>
            </Link>
          </h3>
          <p className={styles.headerDescription}>
            지금 반응이 빠른 질문과 공유 흐름을 먼저 모았습니다. 바로 읽고 대화에 합류할 수 있습니다.
          </p>
        </div>
      </div>

      <div className={styles.filterRow}>
        <Link href="/community" className={`${styles.filterLink} ${styles.filterLinkActive}`}>
          전체
        </Link>
        {visibleCategories.map((category) => (
          <Link key={category.id} href={category.href} className={styles.filterLink}>
            {category.label}
          </Link>
        ))}
      </div>

      <section className={styles.popularSection} aria-label="인기글 TOP 5">
        <div className={styles.subHeaderRow}>
          <h4 className={styles.subHeading}>인기글 TOP 5</h4>
        </div>

        <ul className={styles.popularList}>
          {popularPosts.length > 0 ? (
            popularPosts.map((post, index) => (
              <li key={post.id}>
                <Link href={post.href} className={styles.popularItem}>
                  <div className={styles.popularContent}>
                    <div className={styles.titleRow}>
                      <span className={styles.categoryChip}>{categoryLabelMap[post.category]}</span>
                      {index < 3 ? <span className={styles.hotBadge}>HOT</span> : null}
                    </div>
                    <strong className={styles.postTitle}>{post.title}</strong>
                  </div>
                  <div className={styles.reactionBox}>
                    <span className={styles.rankBadge}>{String(index + 1).padStart(2, '0')}</span>
                    <div className={styles.reactionMeta}>
                      <span>좋아요 {post.likeCount}</span>
                      <span>댓글 {post.commentCount}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className={styles.emptyState}>최근 24시간 기준 인기글이 아직 없습니다.</li>
          )}
        </ul>
      </section>
    </section>
  );
}
