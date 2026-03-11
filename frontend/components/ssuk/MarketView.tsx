'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  marketCards,
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

  return (
    <TwoMenuShell
      activeMenu="market"
      title="공방 쉐어"
      ctaLabel="+ 공방 등록"
      ctaHref="/market/new"
      hideHero
    >
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
                  <p>{item.caption}</p>
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
                </div>
                <span className={styles.trendingPrice}>{card.priceLabel}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.listSection} aria-label="공방 찾아보기">
        <div className={styles.listHeader}>
          <div className={styles.listHeading}>
            <h2>공방 찾아보기</h2>
            <p>총 {filteredStudioCards.length}개</p>
          </div>
          <div className={styles.listControls}>
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

      <div className={styles.ownerCtaWrap}>
        <Link
          href="/market/new"
          className={styles.ownerCta}
          onClick={() => {
            emitMarketEvent('studio_owner_cta_click', { from: 'list' });
          }}
        >
          내 공방 쉐어 등록하기
        </Link>
      </div>
    </TwoMenuShell>
  );
}
