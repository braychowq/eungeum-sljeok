'use client';

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from 'react';
import { ProductAnchor } from '../common/ProductControl';
import ProductFeatureBand from '../common/ProductFeatureBand';
import ProductPager from '../common/ProductPager';
import { BannerItem } from './types';
import styles from './BannerCarousel.module.css';

type BannerCarouselProps = {
  items: BannerItem[];
  autoplayMs?: number;
};

const bannerLabels = ['Community pick', 'Studio share', 'Market edit'] as const;
const bannerNotes = [
  '오늘 가장 먼저 열어볼 메이커 무드를 이미지 중심으로 추린 커뮤니티 에디션입니다.',
  '공방 쉐어와 현장 리듬을 연결하는 장면만 골라 홈 상단에서 먼저 보여줍니다.',
  '판매와 셀렉션 흐름을 제품다운 톤으로 읽게 만드는 마켓 이미지 큐레이션입니다.'
] as const;
const bannerToneMap = ['warm', 'forest', 'neutral'] as const;

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

  const scrollToDisplayIndex = (
    displayIndex: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>('[data-display-index="0"]');
    if (!firstCard) return;

    const computedStyles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || '0');
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

    const computedStyles = window.getComputedStyle(viewport);
    const gap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || '0');
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

      const computedStyles = window.getComputedStyle(viewport);
      const gap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || '0');
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
  const autoAdvance = useEffectEvent(() => {
    const next = (activeIndex + 1) % total;
    setActiveIndex(next);
    scrollToDisplayIndex(total > 1 ? next + 1 : next);
  });

  useEffect(() => {
    if (total <= 1) return undefined;

    const timer = window.setInterval(() => {
      autoAdvance();
    }, autoplayMs);

    return () => window.clearInterval(timer);
  }, [autoplayMs, total]);

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

  const endPointerDrag = () => {
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

  const activeItem = items[activeIndex];
  const activeLabel = bannerLabels[activeIndex % bannerLabels.length] ?? bannerLabels[0];
  const activeNote = bannerNotes[activeIndex % bannerNotes.length] ?? bannerNotes[0];
  const activeTone = bannerToneMap[activeIndex % bannerToneMap.length] ?? bannerToneMap[0];
  const activeProgress =
    total > 0
      ? `${String(activeIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
      : '00 / 00';

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
          const realIndex = total <= 1 ? displayIndex : (displayIndex - 1 + total) % total;

          return (
            <a
              key={`${item.id}-${displayIndex}`}
              data-display-index={displayIndex}
              className={styles.card}
              href={item.href}
              aria-label={`${item.subtitle} 바로가기`}
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

              <div className={styles.cardBadgeRow}>
                <span className={styles.cardKicker}>
                  {bannerLabels[realIndex % bannerLabels.length]}
                </span>
                <span className={styles.cardLabel}>#{String(realIndex + 1).padStart(2, '0')}</span>
              </div>

              <span className={styles.cardArrow} aria-hidden="true">
                ↗
              </span>
            </a>
          );
        })}
      </div>

      <ProductFeatureBand
        tone={activeTone}
        compact
        eyebrow={activeLabel}
        title={activeItem?.subtitle ?? '오늘의 이미지 큐레이션'}
        description={activeNote}
        meta={
          <div className={styles.captionMetaRow}>
            <span className={styles.captionMetaChip}>{activeProgress}</span>
            <span className={styles.captionMetaNote}>
              자동 롤링과 드래그 이동으로 둘러보는 이미지 스테이지
            </span>
          </div>
        }
        action={
          activeItem ? (
            <ProductAnchor
              href={activeItem.href}
              tone="warm"
              variant="primary"
              className={styles.captionAction}
            >
              이 장면 이어보기
            </ProductAnchor>
          ) : null
        }
        className={styles.captionBand}
        bodyClassName={styles.captionBody}
      >
        <ProductPager
          label="배너"
          activeIndex={activeIndex}
          total={total}
          summary={activeItem?.imageAlt ?? activeNote}
          items={items.map((item) => ({
            id: item.id,
            srLabel: `${item.subtitle} 배너`
          }))}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={goToIndex}
          className={styles.pager}
        />
      </ProductFeatureBand>
    </section>
  );
}
