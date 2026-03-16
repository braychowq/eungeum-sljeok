'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import EditorialSelectionDeck from '../common/EditorialSelectionDeck';
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

function formatAvailabilityDate(value: string) {
  const [, month, day] = value.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
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

  const regionHighlights = useMemo(() => {
    const counts = new Map<string, number>();

    filteredStudioCards.forEach((card) => {
      counts.set(card.locationLabel, (counts.get(card.locationLabel) ?? 0) + 1);
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => ({ label, count }));
  }, [filteredStudioCards]);

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

  const signalCards = [
    {
      label: '즉시 연결',
      value: `${bookableCount}곳`,
      description: '오늘 또는 내일 바로 문의 가능한 공방'
    },
    {
      label: '응답 빠름',
      value: `${fastResponseCount}곳`,
      description: '빠른 대화를 기대할 수 있는 공간'
    },
    {
      label: '지역 집중',
      value: regionHighlights[0] ? `${regionHighlights[0].label} ${regionHighlights[0].count}곳` : '전체',
      description: '지금 가장 많이 보이는 지역 흐름'
    }
  ];

  const browseHighlights = [
    { label: '정렬 리듬', value: activeSortLabel },
    { label: '가격 범위', value: priceRangeLabel },
    { label: '현재 1순위', value: topComparisonCard?.title ?? '후보 없음' }
  ];

  const compareMetrics = [
    { label: '즉시 문의', value: `${bookableCount}곳` },
    { label: '응답 빠름', value: `${fastResponseCount}곳` },
    { label: '추천 큐레이션', value: `${recommendedCount}선` }
  ];

  const topComparisonDateLabel = topComparisonCard
    ? formatAvailabilityDate(topComparisonCard.availability.nextAvailableDate)
    : null;

  const nextActionSteps = [
    {
      step: '01',
      title: '무드 읽기',
      description: 'Editor’s Pick과 추천 공방으로 오늘 맞는 공간 톤을 먼저 잡습니다.'
    },
    {
      step: '02',
      title: '조건 압축',
      description: `${activeSortLabel} 기준과 가격 리듬을 함께 보며 후보를 빠르게 좁힙니다.`
    },
    {
      step: '03',
      title: '즉시 연결',
      description: '가능 일정과 응답 속도를 확인하고 바로 문의 흐름으로 넘어갑니다.'
    }
  ];
  const topRegionLabel = regionHighlights[0]
    ? `${regionHighlights[0].label} ${regionHighlights[0].count}곳`
    : '전체 지역';
  const lowestPriceLabel = priceRangeLabel.includes(' - ') ? priceRangeLabel.split(' - ')[0] : priceRangeLabel;
  const sortStory = {
    recommended: {
      title: '추천 흐름으로 후보를 빠르게 압축해보세요',
      description: '일정, 가격, 반응 속도를 한쪽으로 치우치지 않고 함께 읽는 기본 브라우즈 리듬입니다.',
      signal: '가장 먼저 보기 좋은 균형 잡힌 선택'
    },
    popular: {
      title: '지금 반응이 큰 공방부터 훑어보세요',
      description: '조회와 저장이 빠르게 붙는 공간을 먼저 보며 오늘의 온도를 읽는 탐색 모드입니다.',
      signal: '실시간 인기 흐름 중심'
    },
    latest: {
      title: '최근 올라온 공간 위주로 신선하게 둘러보세요',
      description: '새로 등록된 공방을 앞에 두고 일정과 가격 변화를 빠르게 확인하는 흐름입니다.',
      signal: '최근 업데이트 중심'
    },
    price_low: {
      title: '예산에 맞는 공간부터 가볍게 시작해보세요',
      description: '가격 문턱이 낮은 공방부터 먼저 압축해 비용 감도에 맞춰 비교하는 리듬입니다.',
      signal: '예산 우선 브라우즈'
    }
  }[activeSort];
  const sortDeckItems = marketSortOptions.map((option) => {
    const href = option.id === 'recommended' ? '/market' : `/market?sort=${option.id}`;

    if (option.id === 'popular') {
      return {
        id: option.id,
        href,
        eyebrow: 'Reaction first',
        title: option.label,
        description: '인기와 저장 신호가 강한 공방부터 훑으며 빠르게 감도를 맞춥니다.',
        meta: `인기 큐레이션 ${trendingCards.length}곳`,
        badge: '실시간 반응',
        isActive: activeSort === option.id
      };
    }

    if (option.id === 'latest') {
      return {
        id: option.id,
        href,
        eyebrow: 'Fresh drop',
        title: option.label,
        description: '최근 등록된 공간을 먼저 보며 새롭게 열린 일정과 조건을 따라갑니다.',
        meta: topComparisonDateLabel ? `최근 프런트 러너 ${topComparisonDateLabel}` : '새 등록 우선',
        badge: '최신 업데이트',
        isActive: activeSort === option.id
      };
    }

    if (option.id === 'price_low') {
      return {
        id: option.id,
        href,
        eyebrow: 'Budget cue',
        title: option.label,
        description: '낮은 일일 가격부터 비교하며 비용 부담이 적은 공간을 앞에 둡니다.',
        meta: `최저 ${lowestPriceLabel}`,
        badge: '예산 우선',
        isActive: activeSort === option.id
      };
    }

    return {
      id: option.id,
      href,
      eyebrow: 'Balanced match',
      title: option.label,
      description: '예약 가능성과 반응, 가격을 함께 보며 균형 좋은 후보부터 시작합니다.',
      meta: `즉시 문의 ${bookableCount}곳`,
      badge: '기본 브라우즈',
      isActive: activeSort === option.id
    };
  });

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
          <h1 className={styles.overviewTitle}>공방을 찾는 사람과 공유하는 사람을 한 화면 안에서 연결했습니다</h1>
          <p className={styles.overviewDescription}>
            추천과 인기 흐름으로 공간 감도를 먼저 읽고, 아래에서 일정과 가격, 신뢰 신호를 바로 비교해
            문의까지 이어가세요. 공방을 운영 중이라면 같은 리듬 안에서 등록 출발점도 곧바로 확인할 수
            있습니다.
          </p>
          <div className={styles.entryGrid}>
            <div className={styles.entryCard}>
              <span className={styles.entryBadge}>찾고 있어요</span>
              <strong>오늘 연결될 가능성이 높은 공방부터 빠르게 압축</strong>
              <p>큐레이션, 인기, 브라우즈 스테이지를 따라가며 바로 문의 가능한 공간을 먼저 좁혀보세요.</p>
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
              <p>공간 특징과 운영 조건을 정리해 올리고, 문의를 받을 준비를 같은 흐름에서 시작하세요.</p>
              <span className={styles.entryAction}>공방 등록 시작</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.actionBarSection} aria-label="공방 탐색 신호">
        <div className={styles.actionBar}>
          <div className={styles.actionBarText}>
            <span>Studio Dispatch</span>
            <strong>오늘의 공방 탐색을 한 장의 편집본처럼 묶었습니다</strong>
            <p>
              추천 레일로 분위기를 읽고, 아래 브라우즈 스테이지에서 가격과 일정, 신뢰 신호를 한 번에
              눌러보세요.
            </p>
            {regionHighlights.length > 0 ? (
              <div className={styles.browsePillRow} aria-label="많이 보이는 지역">
                {regionHighlights.map((item) => (
                  <span key={item.label} className={styles.browsePill}>
                    {item.label} {item.count}곳
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.signalGrid} aria-label="공방 탐색 요약">
            {signalCards.map((item) => (
              <div key={item.label} className={styles.signalCard}>
                <span className={styles.signalLabel}>{item.label}</span>
                <strong>{item.value}</strong>
                <p className={styles.signalCopy}>{item.description}</p>
              </div>
            ))}
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
        <div className={styles.browseStudio}>
          <div className={styles.browseStage} aria-label="공방 탐색 스테이지">
            <div className={styles.browseLead}>
              <div className={styles.browseLeadText}>
                <span className={styles.browseEyebrow}>Selection Brief</span>
                <strong>{activeSortLabel} 기준으로 지금 연결하기 좋은 공방을 골라보세요</strong>
                <p>
                  위 큐레이션에서 분위기를 읽었다면, 여기서는 가격과 일정, 신뢰 신호를 함께 보며 실제로
                  연결할 후보를 압축하면 됩니다.
                </p>
              </div>

              <div className={styles.browseStats} aria-label="공방 탐색 요약">
                {browseHighlights.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.flowSteps} aria-label="공방 탐색 단계">
                {nextActionSteps.map((item) => (
                  <div key={item.step} className={styles.flowStepCard}>
                    <span className={styles.flowStepIndex}>{item.step}</span>
                    <div className={styles.flowStepBody}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topComparisonCard ? (
              <Link
                href={topComparisonCard.href}
                className={styles.stageHighlight}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: topComparisonCard.id,
                    sectionType: 'list' as StudioSectionType
                  });
                }}
              >
                <div className={styles.stageHighlightMedia}>
                  <img
                    src={topComparisonCard.imageUrl}
                    alt={`${topComparisonCard.title} ${topComparisonCard.locationLabel} 대표 이미지`}
                    loading="lazy"
                  />
                  <span className={styles.stageHighlightBadge}>Front Runner</span>
                </div>
                <div className={styles.stageHighlightBody}>
                  <span className={styles.compareEyebrow}>Lead Studio</span>
                  <strong>{topComparisonCard.title}</strong>
                  <p>
                    {topComparisonCard.locationLabel} · {topComparisonCard.capacityLabel} · 다음 가능일{' '}
                    {topComparisonDateLabel}
                  </p>
                  <div className={styles.stageHighlightMetrics}>
                    {compareMetrics.map((item) => (
                      <div key={item.label} className={styles.stageHighlightMetric}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.badgeRow}>
                    {topComparisonCard.trustBadges.map((badge) => (
                      <span
                        key={`highlight-${topComparisonCard.id}-${badge}`}
                        className={`${styles.trustBadge} ${trustBadgeClass[badge]}`}
                      >
                        {trustBadgeLabel[badge]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ) : null}
          </div>

          <div className={styles.priorityPanel}>
            <div className={styles.priorityPanelHeader}>
              <span className={styles.priorityEyebrow}>Quick Shortlist</span>
              <strong>바로 문의 넣기 좋은 후보</strong>
              <p>예약 가능 여부와 응답 속도를 먼저 보고, 바로 연결하기 좋은 공방 세 곳을 압축했습니다.</p>
            </div>
            <ol className={styles.priorityLaneList}>
              {contactPriorityCards.map((card, index) => (
                <li key={`priority-${card.id}`}>
                  <Link
                    href={card.href}
                    className={styles.priorityLaneItem}
                    onClick={() => {
                      emitMarketEvent('studio_card_click', {
                        studioId: card.id,
                        sectionType: 'list' as StudioSectionType
                      });
                    }}
                  >
                    <span className={styles.priorityLaneRank}>{String(index + 1).padStart(2, '0')}</span>
                    <div className={styles.priorityLaneBody}>
                      <strong>{card.title}</strong>
                      <p>
                        {card.locationLabel} · {card.capacityLabel}
                      </p>
                      <span>{card.availabilityLabel}</span>
                    </div>
                    <div className={styles.priorityLaneMeta}>
                      <span className={styles.priorityLanePrice}>{card.priceLabel}</span>
                      <span className={styles.priorityLaneStatus}>{toInquiryHint(card)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <EditorialSelectionDeck
          theme="forest"
          eyebrow="Studio Catalogue"
          title={sortStory.title}
          description={`${sortStory.description} 총 ${filteredStudioCards.length}곳을 지금 리듬에 맞춰 다시 정리했습니다.`}
          signals={[
            {
              label: '현재 흐름',
              value: activeSortLabel,
              detail: sortStory.signal
            },
            {
              label: '즉시 문의',
              value: `${bookableCount}곳`,
              detail: '오늘 빠르게 연결할 수 있는 후보'
            },
            {
              label: '지역 신호',
              value: topRegionLabel,
              detail: `현재 카드 기준 가격 ${priceRangeLabel}`
            }
          ]}
          items={sortDeckItems}
          action={{
            href: '/market/new',
            label: '내 공방 등록',
            onClick: () => {
              emitMarketEvent('studio_owner_cta_click', { from: 'catalogue_selection_deck' });
            }
          }}
          ariaLabel="공방 브라우즈 리듬 선택"
        />

        {filteredStudioCards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyStateEyebrow}>No match yet</span>
            <strong>지금 정렬에서는 바로 비교할 후보가 없습니다</strong>
            <p>추천 흐름으로 돌아가거나, 내 공방 등록으로 새로운 연결 흐름을 시작해보세요.</p>
            <div className={styles.emptyStateActions}>
              <Link href="/market" className={styles.emptyStatePrimaryAction}>
                추천 흐름으로 돌아가기
              </Link>
              <Link
                href="/market/new"
                className={styles.emptyStateSecondaryAction}
                onClick={() => {
                  emitMarketEvent('studio_owner_cta_click', { from: 'empty_state' });
                }}
              >
                내 공방 등록
              </Link>
            </div>
          </div>
        ) : (
          <ul className={styles.cardGrid}>
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
