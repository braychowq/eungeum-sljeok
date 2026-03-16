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
};

export default function HorizontalCardSlider({
  id,
  title,
  eyebrow,
  description,
  cardTag,
  cards,
  headerHref
}: HorizontalCardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const slideBy = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;

    const step = Math.max(220, Math.round(track.clientWidth * 0.72));
    const delta = direction === 'next' ? step : -step;
    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id={id} className={styles.section} aria-label={title}>
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
            Prev
          </button>
          <button type="button" onClick={() => slideBy('next')} aria-label={`${title} 다음`}>
            Next
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {cards.map((card) => (
          <a key={card.id} className={styles.card} href={card.href}>
            <div className={styles.imageArea}>
              <img src={card.imageUrl} alt={card.imageAlt} loading="lazy" />
            </div>
            <div className={styles.cardBody}>
              {cardTag ? <span className={styles.cardTag}>{cardTag}</span> : null}
              <h4>{card.title}</h4>
              <span className={styles.cardHint}>자세히 보기</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
