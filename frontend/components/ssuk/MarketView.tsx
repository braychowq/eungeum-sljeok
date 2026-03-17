'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import EditorialSelectionDeck from '../common/EditorialSelectionDeck';
import ProductEditorialCard from '../common/ProductEditorialCard';
import ProductFeatureBand from '../common/ProductFeatureBand';
import { ProductAnchor, ProductLink } from '../common/ProductControl';
import ProductRail from '../common/ProductRail';
import productRailStyles from '../common/ProductRail.module.css';
import ProductSectionHeader from '../common/ProductSectionHeader';
import ProductStatGrid, { type ProductStatGridItem } from '../common/ProductStatGrid';
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

function toInquiryHint(card: StudioListingCard) {
  return card.isBookable ? '즉시 문의 가능' : '대기 요청 가능';
}

function formatAvailabilityDate(value: string) {
  const [, month, day] = value.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

function toStudioNarrative(card: StudioListingCard) {
  return `${card.locationLabel} · ${card.capacityLabel} · ${formatAvailabilityDate(card.availability.nextAvailableDate)}부터 일정 확인`;
}

function toShortlistNarrative(card: StudioListingCard) {
  return `${card.capacityLabel} 기준 ${formatAvailabilityDate(card.availability.nextAvailableDate)}부터 ${
    card.isBookable ? '즉시 문의' : '대기 요청'
  } 흐름을 시작할 수 있습니다.`;
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
  const topComparisonDateLabel = topComparisonCard
    ? formatAvailabilityDate(topComparisonCard.availability.nextAvailableDate)
    : null;

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

  const signalCards: ProductStatGridItem[] = [
    {
      label: '즉시 연결',
      value: `${bookableCount}곳`,
      description: '오늘 또는 내일 바로 문의 가능한 공방',
      emphasis: 'support'
    },
    {
      label: '응답 빠름',
      value: `${fastResponseCount}곳`,
      description: '빠른 대화를 기대할 수 있는 공간',
      emphasis: 'accent'
    },
    {
      label: '지역 집중',
      value: topRegionLabel,
      description: '지금 가장 많이 보이는 지역 흐름'
    }
  ];

  const browseHighlights: ProductStatGridItem[] = [
    {
      label: '정렬 리듬',
      value: activeSortLabel,
      description: sortStory.signal,
      emphasis: 'support'
    },
    {
      label: '가격 범위',
      value: priceRangeLabel,
      description: '오늘 브라우즈 중인 전체 공방 가격대'
    },
    {
      label: '현재 1순위',
      value: topComparisonCard?.title ?? '후보 없음',
      description: topComparisonDateLabel ? `다음 가능일 ${topComparisonDateLabel}` : '대표 후보를 다시 정리합니다',
      emphasis: 'warm'
    }
  ];

  const compareMetrics: ProductStatGridItem[] = [
    {
      label: '즉시 문의',
      value: `${bookableCount}곳`,
      description: '오늘 빠르게 연락 가능한 후보',
      emphasis: 'support'
    },
    {
      label: '응답 빠름',
      value: `${fastResponseCount}곳`,
      description: '대화 템포가 좋은 공간'
    },
    {
      label: '추천 큐레이션',
      value: `${recommendedCount}선`,
      description: '에디터가 먼저 추린 공방',
      emphasis: 'accent'
    }
  ];
  const compareSnapshot: ProductStatGridItem[] = compareMetrics.map(({ label, value, emphasis }) => ({
    label,
    value,
    emphasis
  }));

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
        <ProductFeatureBand
          tone="forest"
          titleAs="h1"
          eyebrow="Studio Share"
          title="공방을 찾는 사람과 공유하는 사람을 한 화면 안에서 연결했습니다"
          description={
            <>
              추천과 인기 흐름으로 공간 감도를 먼저 읽고, 아래에서 일정과 가격, 신뢰 신호를 바로
              비교해 문의까지 이어가세요. 공방을 운영 중이라면 같은 리듬 안에서 등록 출발점도 곧바로
              확인할 수 있습니다.
            </>
          }
          meta={
            <div className={styles.overviewPillRow} aria-label="공방 쉐어 요약">
              <span className={styles.overviewPill}>현재 흐름 {activeSortLabel}</span>
              <span className={styles.overviewPill}>추천 큐레이션 {recommendedCount}선</span>
              <span className={styles.overviewPill}>{topRegionLabel}</span>
            </div>
          }
          action={
            <div className={styles.featureActionRow}>
              <ProductAnchor
                href="#studio-browser"
                tone="forest"
                variant="primary"
                className={styles.featurePrimaryAction}
              >
                비교 스테이지로 이동
              </ProductAnchor>
              <ProductLink
                href="/market/new"
                tone="forest"
                variant="secondary"
                className={styles.featureSecondaryAction}
                onClick={() => {
                  emitMarketEvent('studio_owner_cta_click', { from: 'overview_band' });
                }}
              >
                내 공방 등록
              </ProductLink>
            </div>
          }
          className={styles.overviewBand}
          bodyClassName={styles.overviewBandBody}
        >
          <ProductStatGrid
            items={signalCards}
            size="sm"
            ariaLabel="공방 쉐어 핵심 신호"
            className={styles.overviewSignalGrid}
          />
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
        </ProductFeatureBand>
      </section>

      <section className={styles.actionBarSection} aria-label="공방 탐색 신호">
        <ProductFeatureBand
          tone="forest"
          eyebrow="Studio Dispatch"
          title="오늘의 공방 탐색을 한 장의 편집본처럼 묶었습니다"
          description="추천 레일로 분위기를 읽고, 아래 브라우즈 스테이지에서 가격과 일정, 신뢰 신호를 한 번에 눌러보세요."
          meta={
            regionHighlights.length > 0 ? (
              <div className={styles.browsePillRow} aria-label="많이 보이는 지역">
                {regionHighlights.map((item) => (
                  <span key={item.label} className={styles.browsePill}>
                    {item.label} {item.count}곳
                  </span>
                ))}
              </div>
            ) : undefined
          }
          action={
            <div className={styles.featureActionRow}>
              <ProductAnchor
                href="#studio-browser"
                tone="forest"
                variant="primary"
                className={styles.featurePrimaryAction}
              >
                비교 구간으로 이동
              </ProductAnchor>
              <ProductLink
                href={topComparisonCard?.href ?? '/market'}
                tone="forest"
                variant="secondary"
                className={styles.featureSecondaryAction}
                onClick={() => {
                  if (topComparisonCard) {
                    emitMarketEvent('studio_card_click', {
                      studioId: topComparisonCard.id,
                      sectionType: 'list' as StudioSectionType
                    });
                  }
                }}
              >
                프런트 러너 보기
              </ProductLink>
            </div>
          }
          className={styles.dispatchBand}
          bodyClassName={styles.dispatchBandBody}
        >
          <div className={styles.dispatchGrid}>
            <div className={styles.dispatchSurface}>
              <span className={styles.dispatchSurfaceEyebrow}>Browse Lens</span>
              <ProductStatGrid
                items={browseHighlights}
                size="sm"
                ariaLabel="공방 브라우즈 렌즈"
                className={styles.dispatchStatGrid}
              />
            </div>
            <div className={styles.dispatchSurface}>
              <span className={styles.dispatchSurfaceEyebrow}>Connection Cue</span>
              <ProductStatGrid
                items={compareMetrics}
                size="sm"
                ariaLabel="공방 연결 신호"
                className={styles.dispatchStatGrid}
              />
            </div>
          </div>
        </ProductFeatureBand>
      </section>

      <section className={styles.heroSection} aria-label="Editor Pick">
        <ProductSectionHeader
          tone="forest"
          className={styles.sectionHeader}
          eyebrow="Editor's Cut"
          title="오늘의 공방 톤을 먼저 읽는 시작 레일"
          description="분위기와 운영 결이 선명한 공간부터 훑고, 아래 비교 구간으로 자연스럽게 이어지도록 첫 장면을 편집했습니다."
          compact
          action={
            <ProductRail
              label="Editor Pick"
              summary={`${studioHeroPicks.length} scenes`}
              canScrollPrev={heroRail.canScrollPrev}
              canScrollNext={heroRail.canScrollNext}
              onPrev={heroRail.scrollPrev}
              onNext={heroRail.scrollNext}
              className={styles.sectionRailControl}
            />
          }
        />
        <ul ref={heroRail.railRef} className={`${styles.heroCarousel} ${productRailStyles.track}`}>
          {studioHeroPicks.map((pick, index) => (
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
                <div className={styles.heroMedia}>
                  <img src={pick.imageUrl} alt={`${pick.title} 공방 큐레이션 배너`} loading="lazy" />
                  <span className={styles.heroFrameIndex}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className={styles.heroBody}>
                  <span className={styles.heroBadge}>{pick.badge}</span>
                  <strong>{pick.title}</strong>
                  <p>{pick.subtitle}</p>
                  <span className={styles.heroCue}>공방 상세 보기</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.curatedSection} aria-label="추천 공방">
        <ProductSectionHeader
          tone="forest"
          className={styles.sectionHeader}
          eyebrow="Balanced Match"
          title="추천 공방"
          description="가격과 분위기, 운영 조건의 균형이 좋은 공간을 먼저 압축해 빠르게 후보를 좁힙니다."
          compact
          action={
            <ProductRail
              label="추천 공방"
              summary={`${recommendedCount} picks`}
              canScrollPrev={recommendationRail.canScrollPrev}
              canScrollNext={recommendationRail.canScrollNext}
              onPrev={recommendationRail.scrollPrev}
              onNext={recommendationRail.scrollNext}
              className={styles.sectionRailControl}
            />
          }
        />
        <ul
          ref={recommendationRail.railRef}
          className={`${styles.recommendList} ${productRailStyles.track}`}
        >
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
        <ProductSectionHeader
          tone="forest"
          className={styles.sectionHeader}
          eyebrow="Live Reaction"
          title="인기 공방"
          description="지금 반응이 몰리는 공간과 일정 신호를 짧고 빠르게 훑을 수 있도록 속도감 있는 레일로 정리했습니다."
          compact
          action={
            <ProductRail
              label="인기 공방"
              summary={`Top ${trendingCards.length}`}
              canScrollPrev={trendingRail.canScrollPrev}
              canScrollNext={trendingRail.canScrollNext}
              onPrev={trendingRail.scrollPrev}
              onNext={trendingRail.scrollNext}
              className={styles.sectionRailControl}
            />
          }
        />
        <ol ref={trendingRail.railRef} className={`${styles.trendingList} ${productRailStyles.track}`}>
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

      <section id="studio-browser" className={styles.listSection} aria-label="공방 찾아보기">
        <ProductSectionHeader
          tone="forest"
          className={styles.sectionHeader}
          eyebrow="Studio Browser"
          title="조건과 일정, 응답 속도를 한 화면에서 비교하기"
          description="위 큐레이션으로 공간 감도를 잡았다면, 여기서는 실제 연결 후보를 압축할 차례입니다. 가격, 가능 일정, 신뢰 신호를 같은 리듬으로 정리했습니다."
          compact
        />

        <div className={styles.browseStudio}>
          <ProductFeatureBand
            tone="forest"
            eyebrow="Studio Browser"
            title={`${activeSortLabel} 기준으로 지금 연결하기 좋은 공방을 골라보세요`}
            description="위 큐레이션에서 분위기를 읽었다면, 여기서는 가격과 일정, 신뢰 신호를 함께 보며 실제로 연결할 후보를 압축하면 됩니다."
            meta={
              <div className={styles.browsePillRow}>
                <span className={styles.browsePill}>현재 흐름 {activeSortLabel}</span>
                <span className={styles.browsePill}>즉시 문의 {bookableCount}곳</span>
                <span className={styles.browsePill}>핵심 지역 {topRegionLabel}</span>
              </div>
            }
            className={styles.browseBand}
            bodyClassName={styles.browseBandBody}
          >
            <div className={styles.browseLead}>
              <ProductStatGrid
                items={browseHighlights}
                size="sm"
                ariaLabel="공방 탐색 요약"
                className={styles.browseStats}
              />

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
              <ProductEditorialCard
                href={topComparisonCard.href}
                tone="warm"
                badge="Front Runner"
                eyebrow="Lead Studio"
                heading={topComparisonCard.title}
                description={toStudioNarrative(topComparisonCard)}
                media={
                  <img
                    src={topComparisonCard.imageUrl}
                    alt={`${topComparisonCard.title} ${topComparisonCard.locationLabel} 대표 이미지`}
                    loading="lazy"
                  />
                }
                signals={
                  <>
                    <span className={styles.editorialSignal}>{topComparisonCard.priceLabel}</span>
                    <span className={styles.editorialSignal}>{topComparisonCard.availabilityLabel}</span>
                    <span className={styles.editorialSignal}>{toInquiryHint(topComparisonCard)}</span>
                  </>
                }
                stats={
                  <ProductStatGrid
                    items={compareSnapshot}
                    size="sm"
                    ariaLabel="프런트 러너 비교 지표"
                    className={styles.stageCardStats}
                  />
                }
                footer={
                  <div className={styles.cardFooterRow}>
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
                    <span className={styles.contactHint}>{toInquiryHint(topComparisonCard)}</span>
                  </div>
                }
                className={styles.stageCard}
                onClick={() => {
                  emitMarketEvent('studio_card_click', {
                    studioId: topComparisonCard.id,
                    sectionType: 'list' as StudioSectionType
                  });
                }}
              />
            ) : null}
          </ProductFeatureBand>

          <ProductFeatureBand
            tone="forest"
            compact
            eyebrow="Quick Shortlist"
            title="바로 문의 넣기 좋은 후보"
            description="예약 가능 여부와 응답 속도를 먼저 보고, 바로 연결하기 좋은 공방 세 곳을 압축했습니다."
            meta={
              <div className={styles.browsePillRow}>
                <span className={styles.browsePill}>응답 빠름 {fastResponseCount}곳</span>
                <span className={styles.browsePill}>우선 비교 {contactPriorityCards.length}선</span>
              </div>
            }
            className={styles.priorityBand}
            bodyClassName={styles.priorityBandBody}
          >
            <ol className={styles.priorityLaneList}>
              {contactPriorityCards.map((card, index) => (
                <li key={`priority-${card.id}`}>
                  <ProductEditorialCard
                    href={card.href}
                    tone="forest"
                    layout="text"
                    compact
                    badge={String(index + 1).padStart(2, '0')}
                    eyebrow={card.locationLabel}
                    heading={card.title}
                    description={toShortlistNarrative(card)}
                    signals={
                      <>
                        <span className={styles.editorialSignal}>{card.priceLabel}</span>
                        <span className={styles.editorialSignal}>{card.availabilityLabel}</span>
                      </>
                    }
                    footer={
                      <div className={styles.cardFooterRow}>
                        <div className={styles.badgeRow}>
                          {card.trustBadges.map((badge) => (
                            <span
                              key={`priority-${card.id}-${badge}`}
                              className={`${styles.trustBadge} ${trustBadgeClass[badge]}`}
                            >
                              {trustBadgeLabel[badge]}
                            </span>
                          ))}
                        </div>
                        <span className={styles.contactHint}>{toInquiryHint(card)}</span>
                      </div>
                    }
                    className={styles.priorityLaneCard}
                    onClick={() => {
                      emitMarketEvent('studio_card_click', {
                        studioId: card.id,
                        sectionType: 'list' as StudioSectionType
                      });
                    }}
                  />
                </li>
              ))}
            </ol>
          </ProductFeatureBand>
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
          <ProductFeatureBand
            tone="forest"
            compact
            eyebrow="No match yet"
            title="지금 정렬에서는 바로 비교할 후보가 없습니다"
            description="추천 흐름으로 돌아가거나, 내 공방 등록으로 새로운 연결 흐름을 시작해보세요."
            meta={
              <div className={styles.emptyStateMeta}>
                <span className={styles.emptyStatePill}>현재 정렬 {activeSortLabel}</span>
                <span className={styles.emptyStatePill}>추천 큐레이션 {recommendedCount}선</span>
              </div>
            }
            action={
              <div className={styles.emptyStateActions}>
                <ProductLink
                  href="/market"
                  tone="forest"
                  variant="primary"
                  size="sm"
                  className={styles.emptyStatePrimaryAction}
                >
                  추천 흐름으로 돌아가기
                </ProductLink>
                <ProductLink
                  href="/market/new"
                  tone="forest"
                  variant="secondary"
                  size="sm"
                  className={styles.emptyStateSecondaryAction}
                  onClick={() => {
                    emitMarketEvent('studio_owner_cta_click', { from: 'empty_state' });
                  }}
                >
                  내 공방 등록
                </ProductLink>
              </div>
            }
            className={styles.emptyStateBand}
          />
        ) : (
          <ul className={styles.cardGrid}>
            {filteredStudioCards.map((card, index) => (
              <li key={card.id}>
                <ProductEditorialCard
                  href={card.href}
                  tone={index === 0 ? 'warm' : 'forest'}
                  layout={index === 0 ? 'split' : 'stacked'}
                  compact={index !== 0}
                  badge={String(index + 1).padStart(2, '0')}
                  eyebrow={card.locationLabel}
                  heading={card.title}
                  description={toStudioNarrative(card)}
                  media={
                    <img
                      src={card.imageUrl}
                      alt={`${card.title} ${card.locationLabel} 공방 사진`}
                      loading="lazy"
                    />
                  }
                  signals={
                    <>
                      <span className={styles.editorialSignal}>{card.priceLabel}</span>
                      <span className={styles.editorialSignal}>{card.availabilityLabel}</span>
                    </>
                  }
                  footer={
                    <div className={styles.cardFooterRow}>
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
                  }
                  className={`${styles.catalogueCard} ${index === 0 ? styles.catalogueFeaturedCard : ''}`}
                  onClick={() => {
                    emitMarketEvent('studio_card_click', {
                      studioId: card.id,
                      sectionType: 'list' as StudioSectionType
                    });
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </TwoMenuShell>
  );
}
