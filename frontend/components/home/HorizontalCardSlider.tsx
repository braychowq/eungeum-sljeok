'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { SliderCard } from './types';
import styles from './HorizontalCardSlider.module.css';

type HorizontalCardSliderProps = {
  id: string;
  title: string;
  cards: SliderCard[];
  headerHref?: string;
};

export default function HorizontalCardSlider({
  id,
  title,
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
        <h3 className={styles.heading}>
          {headerHref ? (
            <Link href={headerHref} className={styles.headerLink}>
              <span className={styles.headerTitle}>{title}</span>
            </Link>
          ) : (
            <span className={styles.headerTitle}>{title}</span>
          )}
        </h3>
        <div className={styles.actions}>
          <button type="button" onClick={() => slideBy('prev')} aria-label={`${title} 이전`}>
            {'<'}
          </button>
          <button type="button" onClick={() => slideBy('next')} aria-label={`${title} 다음`}>
            {'>'}
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef}>
        {cards.map((card) => (
          <a key={card.id} className={styles.card} href={card.href}>
            <div className={styles.imageArea}>
              <img src={card.imageUrl} alt={card.imageAlt} loading="lazy" />
            </div>
            <h4>{card.title}</h4>
          </a>
        ))}
      </div>
    </section>
  );
}
