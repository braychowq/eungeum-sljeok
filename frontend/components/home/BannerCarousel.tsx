'use client';

import { useEffect, useMemo, useState } from 'react';
import { BannerItem } from './types';
import styles from './BannerCarousel.module.css';

type BannerCarouselProps = {
  items: BannerItem[];
  autoplayMs?: number;
};

export default function BannerCarousel({
  items,
  autoplayMs = 4500
}: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;

  const activeItem = useMemo(() => items[activeIndex], [items, activeIndex]);

  useEffect(() => {
    if (total <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [autoplayMs, total]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  if (!activeItem) return null;

  return (
    <section className={styles.section} aria-label="배너 롤링">
      <div className={styles.slide}>
        <a
          className={styles.imageArea}
          href={activeItem.href}
          aria-label={`${activeItem.title} 바로가기`}
        >
          <img src={activeItem.imageUrl} alt={activeItem.imageAlt} loading="eager" />
        </a>
      </div>

      <button
        className={`${styles.arrow} ${styles.prev}`}
        type="button"
        onClick={goPrev}
        aria-label="이전 배너"
      >
        {'<'}
      </button>
      <button
        className={`${styles.arrow} ${styles.next}`}
        type="button"
        onClick={goNext}
        aria-label="다음 배너"
      >
        {'>'}
      </button>

      <div className={styles.dots} role="tablist" aria-label="배너 페이지네이션">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${index + 1}번 배너`}
            className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
