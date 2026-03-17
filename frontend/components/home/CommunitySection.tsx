'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import ProductEditorialCard from '../common/ProductEditorialCard';
import ProductFeatureBand from '../common/ProductFeatureBand';
import { ProductLink } from '../common/ProductControl';
import ProductStatGrid, { type ProductStatGridItem } from '../common/ProductStatGrid';
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

const categoryToneMap = {
  qna: 'warm',
  share: 'forest',
  free: 'neutral'
} as const;

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

const formatPublishedLabel = (publishedHoursAgo: number) =>
  publishedHoursAgo <= 1 ? '방금 올라온 대화' : `${publishedHoursAgo}시간 전 업로드`;

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
  const pulseStats = pulseCategories.slice(0, 3).map(
    (category, index): ProductStatGridItem => ({
      label: category.label,
      value: `${category.count}개`,
      description: index === 0 ? '지금 가장 빠른 흐름' : '오늘 이어지는 대화',
      emphasis: category.id === 'qna' ? 'warm' : category.id === 'share' ? 'accent' : 'support'
    })
  );

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
          <ProductFeatureBand
            eyebrow="24h pulse"
            title={`${activePulseCount}개 대화가 지금 반응 중`}
            description="질문, 공유, 아무말을 따로 끊지 않고 오늘 가장 빠르게 번지는 대화만 다시 엮었습니다."
            tone="forest"
            compact
            className={styles.metricBand}
            bodyClassName={styles.metricBandBody}
          >
            <ProductStatGrid
              items={pulseStats}
              columns={3}
              size="sm"
              ariaLabel="최근 24시간 커뮤니티 대화 통계"
              className={styles.metricGrid}
            />
          </ProductFeatureBand>
        }
      >
        <div className={styles.filterRow}>
          <ProductLink
            href="/community"
            tone="warm"
            variant="secondary"
            size="sm"
            selected
            className={styles.filterChip}
          >
            전체
          </ProductLink>
          {visibleCategories.map((category) => (
            <ProductLink
              key={category.id}
              href={category.href}
              tone={categoryToneMap[category.id]}
              variant="secondary"
              size="sm"
              className={styles.filterChip}
            >
              <span>{category.label}</span>
              <span className={styles.filterCount}>{category.count}</span>
            </ProductLink>
          ))}
        </div>

        <section className={styles.popularSection} aria-label="인기글 TOP 5">
          <div className={styles.layout}>
            {leadPost ? (
              <ProductEditorialCard
                href={leadPost.href}
                tone={categoryToneMap[leadPost.category]}
                layout="text"
                badge="Top 01"
                eyebrow={categoryLabelMap[leadPost.category]}
                heading={<span className={styles.featuredTitle}>{leadPost.title}</span>}
                description="좋아요와 댓글이 빠르게 붙고 있는 글입니다. 지금 읽고 바로 대화에 참여하면 흐름을 가장 덜 놓칩니다."
                signals={
                  <div className={styles.signalRow}>
                    <span className={styles.signalChip}>최근 24h</span>
                    <span className={styles.signalChip}>
                      {formatPublishedLabel(leadPost.publishedHoursAgo)}
                    </span>
                    <span className={styles.signalChip}>조회 {leadPost.viewCount}</span>
                  </div>
                }
                stats={
                  <ProductStatGrid
                    items={[
                      { label: '좋아요', value: `${leadPost.likeCount}`, emphasis: 'warm' },
                      { label: '댓글', value: `${leadPost.commentCount}`, emphasis: 'accent' },
                      { label: '조회', value: `${leadPost.viewCount}`, emphasis: 'support' }
                    ]}
                    columns={3}
                    size="sm"
                    ariaLabel="대표 인기글 반응 통계"
                    className={styles.leadStatGrid}
                  />
                }
                footer={
                  <div className={styles.cardFooter}>
                    <span className={styles.cardNote}>오늘 가장 빠르게 반응이 붙는 글</span>
                    <span className={styles.cardActionPill}>대화 읽기</span>
                  </div>
                }
                className={styles.featuredCard}
                bodyClassName={styles.featuredCardBody}
              />
            ) : (
              <div className={styles.emptyState}>최근 24시간 기준 인기글이 아직 없습니다.</div>
            )}

            <div className={styles.sideColumn}>
              <div className={styles.subHeaderRow}>
                <h4 className={styles.subHeading}>지금 뜨는 대화</h4>
                <Link href="/community" className={styles.subLink}>
                  전체 커뮤니티
                </Link>
              </div>

              <ol className={styles.popularList}>
                {sidePosts.length > 0 ? (
                  sidePosts.map((post, index) => (
                    <li key={post.id}>
                      <ProductEditorialCard
                        href={post.href}
                        tone={categoryToneMap[post.category]}
                        layout="text"
                        compact
                        badge={String(index + 2).padStart(2, '0')}
                        eyebrow={categoryLabelMap[post.category]}
                        heading={<span className={styles.postTitle}>{post.title}</span>}
                        description={formatPublishedLabel(post.publishedHoursAgo)}
                        signals={
                          <div className={styles.signalRow}>
                            {index < 2 ? <span className={styles.hotChip}>Hot</span> : null}
                            <span className={styles.signalChip}>좋아요 {post.likeCount}</span>
                            <span className={styles.signalChip}>댓글 {post.commentCount}</span>
                          </div>
                        }
                        footer={
                          <div className={styles.cardFooter}>
                            <span className={styles.cardNote}>반응이 빠른 순서</span>
                            <span className={styles.cardActionPill}>읽어보기</span>
                          </div>
                        }
                        className={styles.postCard}
                      />
                    </li>
                  ))
                ) : leadPost ? (
                  <li className={styles.sideEmptyState}>대표 글 외 추가 인기글이 아직 없습니다.</li>
                ) : null}
              </ol>
            </div>
          </div>
        </section>
      </HomeSectionFrame>
    </section>
  );
}
