'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  marketCards,
  marketSortOptions,
  studioHeroPicks,
  studioRecommendations,
  studioTrending,
  type MarketSort,
  type StudioListingCard,
  type StudioTrustBadge
} from './mockData';
import TwoMenuShell from './TwoMenuShell';
import { useHorizontalRail } from './useHorizontalRail';
import styles from './MarketView.module.css';

type MarketViewProps = {
  activeSort: MarketSort;
};

type StudioSectionType = 'hero' | 'recommendation' | 'trending' | 'list';

type MarketEventName = 'studio_card_click' | 'studio_owner_cta_click';

type RailButtonsProps = {
  label: string;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

const trustBadgeLabel: Record<StudioTrustBadge, string> = {
  verified: '검증됨',
  policy: '정책확인',
  fast_response: '응답빠름'
};

const trustBadgeClass: Record<StudioTrustBadge, string> = {
  verified: styles.badgeVerified,
  policy: styles.badgePolicy,
  fast_response: styles.badgeFast
};

function emitMarketEvent(eventName: MarketEventName, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') {
    return;
  }

  const detail = { eventName, ...payload };
  window.dispatchEvent(new CustomEvent('ssuk-market-analytics', { detail }));

  if (process.env.NODE_ENV !== 'production') {
    console.info('[ssuk-market-analytics]', detail);
  }
}

function RailButtons({
  label,
  canScrollPrev,
  canScrollNext,
  onPrev,
  onNext
}: RailButtonsProps) {
  return (
    <div className={styles.railActions} aria-label={`${label} 이동`}>
      <button
        type="button"
        className={styles.railButton}
        onClick={onPrev}
        disabled={!canScrollPrev}
        aria-label={`${label} 이전`}
      >
        &lt;
      </button>
      <button
        type="button"
        className={styles.railButton}
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label={`${label} 다음`}
      >
        &gt;
      </button>
    </div>
  );
}

function toInquiryHint(card: StudioListingCard) {
  return card.isBookable ? '즉시 문의 가능' : '대기 요청 가능';
}

export default function MarketView({ activeSort }: MarketViewProps) {
  const studioCards = useMemo(
    () => marketCards.filter((card) => card.tab === 'studio' && card.imageUrl.trim().length > 0),
    []
  );

  const studioCardMap = useMemo(() => new Map(studioCards.map((card) => [card.id, card])), [studioCards]);

  const filteredStudioCards = useMemo(() => {
    let next = [...studioCards];

    if (activeSort === 'popular') {
      next.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (activeSort === 'latest') {
      next.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (activeSort === 'price_low') {
      next.sort((a, b) => a.dayPrice - b.dayPrice);
    } else {
      next.sort((a, b) => {
        if (a.isBookable !== b.isBookable) {
          return a.isBookable ? -1 : 1;
        }
        return b.popularityScore - a.popularityScore;
      });
    }

    return next;
  }, [activeSort, studioCards]);

  const recommendationCards = useMemo(
    () =>
      studioRecommendations
        .map((item) => {
          const card = studioCardMap.get(item.cardId);
          return card ? { item, card } : null;
        })
        .filter((value): value is { item: (typeof studioRecommendations)[number]; card: StudioListingCard } =>
          Boolean(value)
        ),
    [studioCardMap]
  );

  const trendingCards = useMemo(
    () =>
      studioTrending
        .slice(0, 5)
        .map((item) => {
          const card = studioCardMap.get(item.cardId);
          return card ? { item, card } : null;
        })
        .filter((value): value is { item: (typeof studioTrending)[number]; card: StudioListingCard } =>
          Boolean(value)
        ),
    [studioCardMap]
  );

  const heroRail = useHorizontalRail<HTMLUListElement>(studioHeroPicks.length);
  const recommendationRail = useHorizontalRail<HTMLUListElement>(recommendationCards.length);
  const trendingRail = useHorizontalRail<HTMLOListElement>(trendingCards.length);
  const browseRail = useHorizontalRail<HTMLUListElement>(`${activeSort}-${filteredStudioCards.length}`);
  const contactPriorityCards = useMemo(() => {
    const ranked = [...filteredStudioCards].sort((a, b) => {
      if (a.isBookable !== b.isBookable) {
        return a.isBookable ? -1 : 1;
      }

      const aFast = a.trustBadges.includes('fast_response');
      const bFast = b.trustBadges.includes('fast_response');
      if (aFast !== bFast) {
        return aFast ? -1 : 1;
      }

      return b.popularityScore - a.popularityScore;
    });

    return ranked.slice(0, 3);
  }, [filteredStudioCards]);
  const activeSortLabel =
    marketSortOptions.find((option) => option.id === activeSort)?.label ?? '추천순';
  const bookableCount = filteredStudioCards.filter((card) => card.isBookable).length;
  const fastResponseCount = filteredStudioCards.filter((card) =>
    card.trustBadges.includes('fast_response')
  ).length;
  const recommendedCount = recommendationCards.length;
  const topComparisonCard = filteredStudioCards[0];
  const priceRangeLabel = useMemo(() => {
    if (filteredStudioCards.length === 0) {
      return '-';
    }

    const prices = filteredStudioCards.map((card) => card.dayPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const formatter = new Intl.NumberFormat('ko-KR');

    return `₩${formatter.format(minPrice)} - ₩${formatter.format(maxPrice)}`;
  }, [filteredStudioCards]);
  const compareMetrics = [
    { label: '정렬 기준', value: activeSortLabel },
    { label: '즉시 문의', value: `${bookableCount}곳` },
    { label: '가격 범위', value: priceRangeLabel }
  ];
  const nextActionSteps = [
    { step: '01', title: '둘러보기', description: '큐레이션과 인기 공방으로 분위기를 먼저 파악하세요.' },
    { step: '02', title: '비교하기', description: `${activeSortLabel} 기준으로 조건이 맞는 공방을 압축합니다.` },
    { step: '03', title: '문의 넣기', description: '즉시 문의 가능 여부와 응답 속도를 보고 바로 연결하세요.' }
  ];

  return (
    <TwoMenuShell
      activeMenu="market"
      title="공방 쉐어"
      ctaLabel="+ 공방 등록"
      ctaHref="/market/new"
      hideHero
    >
      <section className={styles.overviewSection} aria-label="공방 쉐어 이용 가이드">
        <div className={styles.overviewIntro}>
          <span className={styles.overviewEyebrow}>Studio Share</span>
          <h1 className={styles.overviewTitle}>공방을 찾는 사람과 공유하는 사람을 한 흐름으로 연결했습니다</h1>
          <p className={styles.overviewDescription}>
            먼저 지금 바로 예약 가능한 공방을 둘러보고, 정렬과 큐레이션으로 비교한 뒤 문의까지
            이어가세요. 공방을 운영 중이라면 같은 화면에서 등록 출발점도 바로 확인할 수 있습니다.
          </p>
          <div className={styles.entryGrid}>
            <div className={styles.entryCard}>
              <span className={styles.entryBadge}>찾고 있어요</span>
              <strong>바로 쓸 수 있는 공방을 빠르게 비교</strong>
              <p>추천, 인기, 정렬 비교를 따라가며 현재 문의 가능한 곳부터 좁혀보세요.</p>
              <div className={styles.entryMeta}>
                <span>즉시 문의 {bookableCount}곳</span>
                <span>추천 큐레이션 {recommendedCount}개</span>
              </div>
            </div>
            <Link
              href="/market/new"
              className={styles.entryCardLink}
              onClick={() => {
                emitMarketEvent('studio_owner_cta_click', { from: 'overview_card' });
              }}
            >
              <span className={styles.entryBadge}>공유할게요</span>
              <strong>내 공방 등록으로 바로 진입</strong>
              <p>공간 특징과 운영 조건을 정리해 올리고, 문의를 받을 준비를 시작하세요.</p>
              <span className={styles.entryAction}>공방 등록 시작</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.actionBarSection} aria-label="공방 등록 안내">
        <div className={styles.actionBar}>
          <div className={styles.actionBarText}>
            <strong>공방을 찾고 있나요?</strong>
            <span>등록은 여기서 바로 시작</span>
          </div>
          <Link
            href="/market/new"
            className={styles.actionBarButton}
            onClick={() => {
              emitMarketEvent('studio_owner_cta_click', { from: 'top_bar' });
            }}
          >
            내 공방 등록
          </Link>
        </div>
      </section>

      <section className={styles.heroSection} aria-label="Editor Pick">
        <div className={styles.sectionHeader}>
          <h2>Editor&apos;s Pick</h2>
          <RailButtons
            label="Editor Pick"
            canScrollPrev={heroRail.canScrollPrev}
            canScrollNext={heroRail.canScrollNext}
            onPrev={heroRail.scrollPrev}
            onNext={heroRail.scrollNext}
          />
        </div>
        <ul ref={heroRail.railRef} className={`${styles.heroCarousel} ${styles.railTrack}`}>
          {studioHeroPicks.map((pick) => (
            <li key={pick.id}>
              <Link
                href={pick.href}
                className={styles.heroCard}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: pick.id,
                    sectionType: 'hero'
                  });
                }}
              >
                <img src={pick.imageUrl} alt={`${pick.title} 공방 큐레이션 배너`} loading="lazy" />
                <div className={styles.heroOverlay}>
                  <span>{pick.badge}</span>
                  <strong>{pick.title}</strong>
                  <p>{pick.subtitle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.curatedSection} aria-label="추천 공방">
        <div className={styles.sectionHeader}>
          <h2>추천 공방</h2>
          <RailButtons
            label="추천 공방"
            canScrollPrev={recommendationRail.canScrollPrev}
            canScrollNext={recommendationRail.canScrollNext}
            onPrev={recommendationRail.scrollPrev}
            onNext={recommendationRail.scrollNext}
          />
        </div>
        <ul ref={recommendationRail.railRef} className={`${styles.recommendList} ${styles.railTrack}`}>
          {recommendationCards.map(({ item, card }) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.recommendCard}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: card.id,
                    sectionType: 'recommendation' as StudioSectionType
                  });
                }}
              >
                <img src={card.imageUrl} alt={`${card.title} ${card.locationLabel} 공방 이미지`} loading="lazy" />
                <div className={styles.recommendBody}>
                  <span>{item.title}</span>
                  <strong>{card.title}</strong>
                  <div className={styles.recommendMetaRow}>
                    <span className={styles.recommendMetaChip}>{card.locationLabel}</span>
                    <span className={styles.recommendMetaChip}>{card.priceLabel}</span>
                  </div>
                  <p>{item.caption}</p>
                  <span className={styles.recommendHint}>{toInquiryHint(card)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.trendingSection} aria-label="인기 공방">
        <div className={styles.sectionHeader}>
          <h2>인기 공방</h2>
          <RailButtons
            label="인기 공방"
            canScrollPrev={trendingRail.canScrollPrev}
            canScrollNext={trendingRail.canScrollNext}
            onPrev={trendingRail.scrollPrev}
            onNext={trendingRail.scrollNext}
          />
        </div>
        <ol ref={trendingRail.railRef} className={`${styles.trendingList} ${styles.railTrack}`}>
          {trendingCards.map(({ item, card }) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={styles.trendingItem}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: card.id,
                    sectionType: 'trending' as StudioSectionType
                  });
                }}
              >
                <span className={styles.rank}>{item.rank}</span>
                <div className={styles.trendingText}>
                  <strong>{item.title}</strong>
                  <p>{item.meta}</p>
                  <div className={styles.trendingMetaRow}>
                    <span>{card.locationLabel}</span>
                    <span>{card.availabilityLabel}</span>
                  </div>
                </div>
                <div className={styles.trendingSide}>
                  <span className={styles.trendingPrice}>{card.priceLabel}</span>
                  <span className={styles.trendingHint}>{toInquiryHint(card)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.listSection} aria-label="공방 찾아보기">
        <div className={styles.browseLead}>
          <div className={styles.browseLeadText}>
            <span className={styles.browseEyebrow}>Browse Flow</span>
            <strong>{activeSortLabel}으로 정리한 공방 탐색</strong>
            <p>
              지금 바로 문의 가능한 공방과 응답이 빠른 공방을 먼저 확인한 뒤, 정렬 기준을 바꿔
              비교해 보세요.
            </p>
          </div>
          <div className={styles.browseStats} aria-label="공방 탐색 요약">
            <div>
              <span>즉시 문의 가능</span>
              <strong>{bookableCount}곳</strong>
            </div>
            <div>
              <span>응답 빠름</span>
              <strong>{fastResponseCount}곳</strong>
            </div>
          </div>
        </div>

        <div className={styles.flowSteps} aria-label="공방 탐색 단계">
          {nextActionSteps.map((item) => (
            <div key={item.step} className={styles.flowStepCard}>
              <span className={styles.flowStepIndex}>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.priorityGrid} aria-label="문의 우선 후보와 비교 요약">
          <div className={styles.priorityPanel}>
            <div className={styles.priorityPanelHeader}>
              <span className={styles.priorityEyebrow}>Contact First</span>
              <strong>지금 먼저 문의할 후보</strong>
              <p>예약 가능 여부와 응답 속도를 먼저 보고, 바로 연결하기 좋은 공방부터 압축했습니다.</p>
            </div>
            <ul className={styles.priorityList}>
              {contactPriorityCards.map((card) => (
                <li key={`priority-${card.id}`}>
                  <Link
                    href={card.href}
                    className={styles.priorityItem}
                    onClick={() => {
                      emitMarketEvent('studio_card_click', {
                        studioId: card.id,
                        sectionType: 'list' as StudioSectionType
                      });
                    }}
                  >
                    <div className={styles.priorityItemText}>
                      <strong>{card.title}</strong>
                      <p>
                        {card.locationLabel} · {card.capacityLabel}
                      </p>
                      <span>{card.availabilityLabel}</span>
                    </div>
                    <div className={styles.priorityItemMeta}>
                      <span className={styles.priorityPrice}>{card.priceLabel}</span>
                      <span className={styles.priorityStatus}>{toInquiryHint(card)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className={styles.comparePanel}>
            <span className={styles.compareEyebrow}>Compare Snapshot</span>
            <strong>{activeSortLabel} 기준으로 압축한 비교 포인트</strong>
            <div className={styles.compareMetrics}>
              {compareMetrics.map((item) => (
                <div key={item.label} className={styles.compareMetric}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            {topComparisonCard ? (
              <Link
                href={topComparisonCard.href}
                className={styles.compareLead}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: topComparisonCard.id,
                    sectionType: 'list' as StudioSectionType
                  });
                }}
              >
                <span className={styles.compareLeadEyebrow}>현재 1순위 후보</span>
                <strong>{topComparisonCard.title}</strong>
                <p>
                  {topComparisonCard.locationLabel} · {topComparisonCard.priceLabel} ·{' '}
                  {topComparisonCard.availabilityLabel}
                </p>
              </Link>
            ) : null}
          </aside>
        </div>

        <div className={styles.listHeader}>
          <div className={styles.listHeading}>
            <h2>공방 찾아보기</h2>
            <p>
              {activeSortLabel} 기준 · 총 {filteredStudioCards.length}개
            </p>
          </div>
          <div className={styles.listControls}>
            <div className={styles.sortGroup} aria-label="공방 정렬">
              {marketSortOptions.map((option) => (
                <Link
                  key={option.id}
                  href={option.id === 'recommended' ? '/market' : `/market?sort=${option.id}`}
                  className={`${styles.sortChip} ${activeSort === option.id ? styles.sortChipActive : ''}`}
                  aria-current={activeSort === option.id ? 'page' : undefined}
                >
                  {option.label}
                </Link>
              ))}
            </div>
            <RailButtons
              label="공방 찾아보기"
              canScrollPrev={browseRail.canScrollPrev}
              canScrollNext={browseRail.canScrollNext}
              onPrev={browseRail.scrollPrev}
              onNext={browseRail.scrollNext}
            />
          </div>
        </div>

        {filteredStudioCards.length === 0 ? (
          <p className={styles.emptyState}>조건에 맞는 공방이 없습니다. 정렬을 다시 선택해 보세요.</p>
        ) : (
          <ul ref={browseRail.railRef} className={`${styles.cardGrid} ${styles.railTrack}`}>
            {filteredStudioCards.map((card) => (
              <li key={card.id}>
                <Link
                  href={card.href}
                  className={styles.studioCard}
                  onClick={() => {
                    emitMarketEvent('studio_card_click', {
                      studioId: card.id,
                      sectionType: 'list' as StudioSectionType
                    });
                  }}
                >
                  <img src={card.imageUrl} alt={`${card.title} ${card.locationLabel} 공방 사진`} loading="lazy" />
                  <div className={styles.studioBody}>
                    <strong>{card.title}</strong>
                    <p className={styles.metaText}>
                      {card.locationLabel} · {card.capacityLabel}
                    </p>
                    <p className={styles.priceText}>{card.priceLabel}</p>
                    <p className={styles.availabilityText}>{card.availabilityLabel}</p>
                    <div className={styles.badgeRow}>
                      {card.trustBadges.map((badge) => (
                        <span
                          key={`${card.id}-${badge}`}
                          className={`${styles.trustBadge} ${trustBadgeClass[badge]}`}
                        >
                          {trustBadgeLabel[badge]}
                        </span>
                      ))}
                    </div>
                    <span className={styles.contactHint}>{toInquiryHint(card)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </TwoMenuShell>
  );
}
