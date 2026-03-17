'use client';

import Link from 'next/link';
import { useRef } from 'react';
import ProductEditorialCard from '../common/ProductEditorialCard';
import HomeSectionFrame from './HomeSectionFrame';
import { SliderCard } from './types';
import styles from './HorizontalCardSlider.module.css';

type HorizontalCardSliderProps = {
  id: string;
  sequence: string;
  title: string;
  eyebrow?: string;
  description?: string;
  cardTag?: string;
  cards: SliderCard[];
  headerHref?: string;
  tone?: 'studio' | 'market';
};

export default function HorizontalCardSlider({
  id,
  sequence,
  title,
  eyebrow,
  description,
  cardTag,
  cards,
  headerHref,
  tone = 'studio'
}: HorizontalCardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const featuredCard = cards[0];
  const frameTone = tone === 'market' ? 'gold' : 'moss';

  const slideBy = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;

    const step = Math.max(220, Math.round(track.clientWidth * 0.72));
    const delta = direction === 'next' ? step : -step;
    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id={id} className={styles.section} data-tone={tone} aria-label={title}>
      <HomeSectionFrame
        index={sequence}
        eyebrow={eyebrow ?? title}
        tone={frameTone}
        title={
          headerHref ? (
            <Link href={headerHref} className={styles.headerLink}>
              <span className={styles.headerTitle}>{title}</span>
            </Link>
          ) : (
            <span className={styles.headerTitle}>{title}</span>
          )
        }
        description={description ?? ''}
        aside={
          <div className={styles.editorialMeta}>
            <div className={styles.featuredCardSummary}>
              <span className={styles.summaryLabel}>Featured now</span>
              <strong>{featuredCard?.title ?? title}</strong>
              <p>
                {tone === 'studio'
                  ? '조건과 분위기를 먼저 읽고 바로 공간 비교로 넘어갈 수 있게 묶었습니다.'
                  : '재료와 도구를 장면처럼 훑고 바로 거래 흐름으로 이어지는 셀렉션입니다.'}
              </p>
              <div className={styles.summaryMeta}>
                <div>
                  <span>Selection</span>
                  <strong>{cards.length}컷</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>{cardTag ?? title}</strong>
                </div>
              </div>
            </div>

            <div className={styles.metaFooter}>
              {headerHref ? (
                <Link href={headerHref} className={styles.collectionLink}>
                  전체 컬렉션 보기
                </Link>
              ) : (
                <span className={styles.collectionStatus}>신규 셀렉션 {cards.length}건</span>
              )}

              <div className={styles.actions}>
                <button type="button" onClick={() => slideBy('prev')} aria-label={`${title} 이전`}>
                  &larr;
                </button>
                <button type="button" onClick={() => slideBy('next')} aria-label={`${title} 다음`}>
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        }
      >
        <div className={styles.track} ref={trackRef}>
          {cards.map((card, index) => (
            <ProductEditorialCard
              key={card.id}
              href={card.href}
              tone={tone === 'market' ? 'warm' : 'forest'}
              compact
              media={
                <div className={styles.imageArea}>
                  <img
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              }
              badge={String(index + 1).padStart(2, '0')}
              eyebrow={cardTag ?? title}
              heading={<span className={styles.cardTitle}>{card.title}</span>}
              description={
                tone === 'studio'
                  ? '조건과 분위기를 먼저 읽고 바로 공간 비교로 이어지는 셀렉션입니다.'
                  : '재료와 도구를 장면처럼 훑고 바로 거래 흐름으로 넘어가는 셀렉션입니다.'
              }
              footer={
                <div className={styles.cardFooter}>
                  <span className={styles.cardNote}>
                    {tone === 'studio' ? '공방 셀렉션' : '거래 셀렉션'}
                  </span>
                  <span className={styles.cardHint}>자세히 보기</span>
                </div>
              }
              className={styles.card}
            />
          ))}
        </div>
      </HomeSectionFrame>
    </section>
  );
}
