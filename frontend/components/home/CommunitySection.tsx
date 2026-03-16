'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import HomeSectionFrame from './HomeSectionFrame';
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

  const categorySummaries = useMemo(
    () =>
      (Object.entries(categoryLabelMap) as [CommunityCategory, string][]).map(([category, label]) => ({
        id: category,
        label,
        count: posts.filter((post) => post.category === category && !post.isNotice && !post.isPinned).length,
        href: `/community?tab=${category}`
      })),
    [posts]
  );

  const visibleCategories = useMemo(
    () =>
      categorySummaries.filter((category) =>
        popularPosts.some((post) => post.category === category.id)
      ),
    [categorySummaries, popularPosts]
  );

  const leadPost = popularPosts[0];
  const sidePosts = leadPost ? popularPosts.slice(1) : popularPosts;
  const activePulseCount = posts.filter(isPopularCandidate).length;
  const pulseCategories = visibleCategories.length > 0 ? visibleCategories : categorySummaries;

  return (
    <section id="community" className={styles.section} aria-label="커뮤니티">
      <HomeSectionFrame
        index="01"
        eyebrow="Community pulse"
        tone="clay"
        title={
          <Link href="/community" className={styles.headerLink}>
            <span className={styles.headerTitle}>슬쩍 얘기하기</span>
          </Link>
        }
        description="지금 반응이 빠른 질문과 공유 흐름을 먼저 모았습니다. 바로 읽고 대화에 합류할 수 있습니다."
        aside={
          <div className={styles.metricCard}>
            <span>24h 대화 신호</span>
            <strong>{activePulseCount}개</strong>
            <p>질문, 공유, 아무말 흐름을 한 번에 묶어 오늘 가장 빠른 대화를 먼저 보여줍니다.</p>

            <div className={styles.metricMeta}>
              {pulseCategories.slice(0, 3).map((category) => (
                <div key={category.id}>
                  <span>{category.label}</span>
                  <strong>{category.count}개</strong>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className={styles.filterRow}>
          <Link href="/community" className={`${styles.filterLink} ${styles.filterLinkActive}`}>
            전체
          </Link>
          {visibleCategories.map((category) => (
            <Link key={category.id} href={category.href} className={styles.filterLink}>
              <span>{category.label}</span>
              <strong>{category.count}</strong>
            </Link>
          ))}
        </div>

        <section className={styles.popularSection} aria-label="인기글 TOP 5">
          <div className={styles.layout}>
            {leadPost ? (
              <article className={styles.leadCard}>
                <div className={styles.leadBadgeRow}>
                  <span className={styles.rankBadge}>TOP 01</span>
                  <span className={styles.categoryChip}>{categoryLabelMap[leadPost.category]}</span>
                </div>
                <strong className={styles.leadTitle}>{leadPost.title}</strong>
                <p className={styles.leadDescription}>
                  좋아요와 댓글이 빠르게 붙고 있는 글입니다. 지금 읽고 바로 대화에 참여하면 흐름을 가장
                  놓치지 않습니다.
                </p>
                <dl className={styles.leadStats}>
                  <div>
                    <dt>좋아요</dt>
                    <dd>{leadPost.likeCount}</dd>
                  </div>
                  <div>
                    <dt>댓글</dt>
                    <dd>{leadPost.commentCount}</dd>
                  </div>
                  <div>
                    <dt>조회</dt>
                    <dd>{leadPost.viewCount}</dd>
                  </div>
                </dl>
                <div className={styles.leadActions}>
                  <Link href={leadPost.href} className={styles.primaryLink}>
                    지금 읽기
                  </Link>
                  <Link href="/community" className={styles.secondaryLink}>
                    전체 커뮤니티
                  </Link>
                </div>
              </article>
            ) : (
              <div className={styles.emptyState}>최근 24시간 기준 인기글이 아직 없습니다.</div>
            )}

            <div className={styles.sideColumn}>
              <div className={styles.subHeaderRow}>
                <h4 className={styles.subHeading}>지금 뜨는 대화</h4>
                <span className={styles.subDescription}>반응이 빠른 순서</span>
              </div>

              <ul className={styles.popularList}>
                {sidePosts.length > 0 ? (
                  sidePosts.map((post, index) => (
                    <li key={post.id}>
                      <Link href={post.href} className={styles.popularItem}>
                        <div className={styles.popularContent}>
                          <div className={styles.titleRow}>
                            <span className={styles.categoryChip}>{categoryLabelMap[post.category]}</span>
                            {index < 2 ? <span className={styles.hotBadge}>HOT</span> : null}
                          </div>
                          <strong className={styles.postTitle}>{post.title}</strong>
                        </div>
                        <div className={styles.reactionBox}>
                          <span className={styles.sideRankBadge}>
                            {String(index + 2).padStart(2, '0')}
                          </span>
                          <div className={styles.reactionMeta}>
                            <span>좋아요 {post.likeCount}</span>
                            <span>댓글 {post.commentCount}</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : leadPost ? (
                  <li className={styles.sideEmptyState}>대표 글 외 추가 인기글이 아직 없습니다.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </section>
      </HomeSectionFrame>
    </section>
  );
}
