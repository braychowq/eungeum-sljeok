'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { SliderCard } from './types';
import styles from './HorizontalCardSlider.module.css';

type HorizontalCardSliderProps = {
  id: string;
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

  const slideBy = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;

    const step = Math.max(220, Math.round(track.clientWidth * 0.72));
    const delta = direction === 'next' ? step : -step;
    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id={id} className={styles.section} data-tone={tone} aria-label={title}>
      <div className={styles.sectionShell}>
        <div className={styles.editorialPanel}>
          <div className={styles.headerRow}>
            <div className={styles.headerBlock}>
              {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
              <h3 className={styles.heading}>
                {headerHref ? (
                  <Link href={headerHref} className={styles.headerLink}>
                    <span className={styles.headerTitle}>{title}</span>
                  </Link>
                ) : (
                  <span className={styles.headerTitle}>{title}</span>
                )}
              </h3>
              {description ? <p className={styles.headerDescription}>{description}</p> : null}
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={() => slideBy('prev')} aria-label={`${title} 이전`}>
                &larr;
              </button>
              <button type="button" onClick={() => slideBy('next')} aria-label={`${title} 다음`}>
                &rarr;
              </button>
            </div>
          </div>

          <div className={styles.editorialMeta}>
            <div className={styles.featuredCardSummary}>
              <span className={styles.summaryLabel}>Featured now</span>
              <strong>{featuredCard?.title ?? title}</strong>
              <p>
                {tone === 'studio'
                  ? '조건과 분위기를 먼저 읽고 바로 공간 비교로 넘어갈 수 있게 묶었습니다.'
                  : '재료와 도구를 감도 있는 장면처럼 훑고 바로 상세로 이어지는 흐름입니다.'}
              </p>
            </div>

            {headerHref ? (
              <Link href={headerHref} className={styles.collectionLink}>
                전체 컬렉션 보기
              </Link>
            ) : null}
          </div>
        </div>

        <div className={styles.track} ref={trackRef}>
          {cards.map((card, index) => (
            <a key={card.id} className={styles.card} href={card.href}>
              <div className={styles.imageArea}>
                <img src={card.imageUrl} alt={card.imageAlt} loading={index === 0 ? 'eager' : 'lazy'} />
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.cardBody}>
                {cardTag ? <span className={styles.cardTag}>{cardTag}</span> : null}
                <h4>{card.title}</h4>
                <span className={styles.cardHint}>자세히 보기</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
