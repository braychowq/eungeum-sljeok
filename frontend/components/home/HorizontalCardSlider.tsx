'use client';

import Link from 'next/link';
import { useRef } from 'react';
import ProductEditorialCard from '../common/ProductEditorialCard';
import ProductFeatureBand from '../common/ProductFeatureBand';
import { ProductButton, ProductLink } from '../common/ProductControl';
import ProductStatGrid from '../common/ProductStatGrid';
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
  const featureTone = tone === 'market' ? 'warm' : 'forest';
  const collectionLabel = headerHref ? '전체 컬렉션 보기' : `신규 셀렉션 ${cards.length}건`;

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
          <ProductFeatureBand
            eyebrow="Featured now"
            title={featuredCard?.title ?? title}
            description={
              tone === 'studio'
                ? '조건과 분위기를 먼저 읽고 바로 공간 비교로 넘어갈 수 있게 묶었습니다.'
                : '재료와 도구를 장면처럼 훑고 바로 거래 흐름으로 이어지는 셀렉션입니다.'
            }
            tone={featureTone}
            compact
            className={styles.metaBand}
            bodyClassName={styles.metaBandBody}
          >
            <ProductStatGrid
              items={[
                {
                  label: 'Selection',
                  value: `${cards.length}컷`,
                  description: tone === 'studio' ? '비교할 수 있는 공간 흐름' : '이어볼 수 있는 거래 흐름',
                  emphasis: tone === 'studio' ? 'support' : 'warm'
                },
                {
                  label: 'Focus',
                  value: cardTag ?? title,
                  description: featuredCard?.title ?? title
                }
              ]}
              columns={2}
              mobileColumns={1}
              size="sm"
              ariaLabel={`${title} 셀렉션 요약`}
              className={styles.metaGrid}
            />

            <div className={styles.metaFooter}>
              {headerHref ? (
                <ProductLink
                  href={headerHref}
                  tone={featureTone}
                  variant="secondary"
                  size="sm"
                  className={styles.collectionLink}
                >
                  {collectionLabel}
                </ProductLink>
              ) : (
                <span className={styles.collectionStatus}>{collectionLabel}</span>
              )}

              <div className={styles.actions}>
                <ProductButton
                  type="button"
                  tone={featureTone}
                  variant="secondary"
                  size="sm"
                  iconOnly
                  className={styles.actionButton}
                  onClick={() => slideBy('prev')}
                  aria-label={`${title} 이전`}
                >
                  ←
                </ProductButton>
                <ProductButton
                  type="button"
                  tone={featureTone}
                  variant="secondary"
                  size="sm"
                  iconOnly
                  className={styles.actionButton}
                  onClick={() => slideBy('next')}
                  aria-label={`${title} 다음`}
                >
                  →
                </ProductButton>
              </div>
            </div>
          </ProductFeatureBand>
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
