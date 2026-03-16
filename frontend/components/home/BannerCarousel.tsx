'use client';

import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef(false);
  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false
  });
  const [isDragging, setIsDragging] = useState(false);
  const displayItems = total > 1 ? [items[total - 1], ...items, items[0]] : items;
  const bannerLabels = ['Community pick', 'Studio share', 'Market edit'];

  const scrollToDisplayIndex = (
    displayIndex: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>('[data-display-index="0"]');
    if (!firstCard) return;

    const styles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
    const cardWidth = firstCard.offsetWidth;
    const left = Math.max(0, displayIndex * (cardWidth + gap));

    scrollLockRef.current = true;
    viewport.scrollTo({ left, behavior });

    window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 280);
  };

  const handleScroll = () => {
    if (scrollLockRef.current) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>('[data-display-index="0"]');
    if (!firstCard) return;

    const styles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
    const cardWidth = firstCard.offsetWidth;
    const rawDisplayIndex = viewport.scrollLeft / (cardWidth + gap);
    const displayIndex = Math.round(rawDisplayIndex);

    if (total <= 1) {
      setActiveIndex(0);
      return;
    }

    if (displayIndex <= 0) {
      setActiveIndex(total - 1);
      scrollToDisplayIndex(total, 'auto');
      return;
    }

    if (displayIndex >= total + 1) {
      setActiveIndex(0);
      scrollToDisplayIndex(1, 'auto');
      return;
    }

    const nextRealIndex = displayIndex - 1;
    if (nextRealIndex !== activeIndex) {
      setActiveIndex(nextRealIndex);
    }
  };

  useEffect(() => {
    if (total <= 1) return;
    const raf = window.requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const firstCard = viewport.querySelector<HTMLElement>('[data-display-index="0"]');
      if (!firstCard) return;

      const styles = window.getComputedStyle(viewport);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
      viewport.scrollTo({ left: firstCard.offsetWidth + gap, behavior: 'auto' });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [total]);

  const goToIndex = (index: number) => {
    if (total <= 0) return;
    const normalized = ((index % total) + total) % total;
    setActiveIndex(normalized);
    scrollToDisplayIndex(total > 1 ? normalized + 1 : normalized);
  };

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  useEffect(() => {
    if (total <= 1) return undefined;

    const timer = window.setInterval(() => {
      const next = (activeIndex + 1) % total;
      setActiveIndex(next);
      scrollToDisplayIndex(total > 1 ? next + 1 : next);
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [activeIndex, autoplayMs, total]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    dragStateRef.current.active = true;
    dragStateRef.current.pointerId = event.pointerId;
    dragStateRef.current.startX = event.clientX;
    dragStateRef.current.startScrollLeft = viewport.scrollLeft;
    dragStateRef.current.moved = false;
    setIsDragging(true);

    viewport.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState.active || event.pointerType !== 'mouse') {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 3) {
      dragState.moved = true;
    }

    viewport.scrollLeft = dragState.startScrollLeft - deltaX;
    event.preventDefault();
  };

  const endPointerDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState.active) {
      return;
    }

    const viewport = viewportRef.current;
    if (viewport && dragState.pointerId !== null && viewport.hasPointerCapture(dragState.pointerId)) {
      viewport.releasePointerCapture(dragState.pointerId);
    }

    dragState.active = false;
    dragState.pointerId = null;
    setIsDragging(false);

    if (dragState.moved) {
      window.setTimeout(() => {
        dragStateRef.current.moved = false;
      }, 180);
    } else {
      dragState.moved = false;
    }
  };

  return (
    <section className={styles.section} aria-label="배너 롤링">
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        aria-label="배너 스와이프 영역"
      >
        {displayItems.map((item, displayIndex) => {
          const realIndex =
            total <= 1 ? displayIndex : (displayIndex - 1 + total) % total;

          return (
            <a
              key={`${item.id}-${displayIndex}`}
              data-display-index={displayIndex}
              className={styles.card}
              href={item.href}
              aria-label={`${item.title} 바로가기`}
              onClickCapture={(event) => {
                if (dragStateRef.current.moved) {
                  event.preventDefault();
                  event.stopPropagation();
                  dragStateRef.current.moved = false;
                }
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                loading={realIndex === activeIndex ? 'eager' : 'lazy'}
                draggable={false}
              />
              <div className={styles.cardOverlay}>
                <div className={styles.cardBadgeRow}>
                  <span className={styles.cardKicker}>{bannerLabels[realIndex % bannerLabels.length]}</span>
                  <span className={styles.cardLabel}>#{realIndex + 1}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.subtitle}</p>
                <span className={styles.cardCta}>지금 둘러보기</span>
              </div>
            </a>
          );
        })}
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={handlePrev}
            aria-label="이전 배너"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.controlButton}
            onClick={handleNext}
            aria-label="다음 배너"
          >
            ›
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="배너 페이지네이션">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번 배너`}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>

        <span className={styles.counter} aria-live="polite">
          {total > 0 ? `${activeIndex + 1} / ${total}` : '0 / 0'}
        </span>
      </div>
    </section>
  );
}
