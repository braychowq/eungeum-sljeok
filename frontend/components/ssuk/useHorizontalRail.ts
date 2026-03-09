import { useEffect, useRef, useState } from 'react';

type HorizontalRailState = {
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const EDGE_THRESHOLD = 4;

export function useHorizontalRail<T extends HTMLElement>(syncKey: number | string) {
  const railRef = useRef<T | null>(null);
  const [state, setState] = useState<HorizontalRailState>({
    canScrollPrev: false,
    canScrollNext: false
  });

  useEffect(() => {
    const syncState = () => {
      const node = railRef.current;

      if (!node) {
        return;
      }

      const maxScrollLeft = Math.max(0, node.scrollWidth - node.clientWidth);

      setState({
        canScrollPrev: node.scrollLeft > EDGE_THRESHOLD,
        canScrollNext: maxScrollLeft - node.scrollLeft > EDGE_THRESHOLD
      });
    };

    const node = railRef.current;

    if (!node) {
      return;
    }

    const timeoutId = window.setTimeout(syncState, 240);

    syncState();
    node.addEventListener('scroll', syncState, { passive: true });
    window.addEventListener('resize', syncState);

    return () => {
      window.clearTimeout(timeoutId);
      node.removeEventListener('scroll', syncState);
      window.removeEventListener('resize', syncState);
    };
  }, [syncKey]);

  const scrollByPage = (direction: 1 | -1) => {
    const node = railRef.current;

    if (!node) {
      return;
    }

    const step = Math.max(220, Math.round(node.clientWidth * 0.84));

    node.scrollBy({
      left: step * direction,
      behavior: 'smooth'
    });

    window.setTimeout(() => {
      const current = railRef.current;

      if (!current) {
        return;
      }

      const maxScrollLeft = Math.max(0, current.scrollWidth - current.clientWidth);

      setState({
        canScrollPrev: current.scrollLeft > EDGE_THRESHOLD,
        canScrollNext: maxScrollLeft - current.scrollLeft > EDGE_THRESHOLD
      });
    }, 280);
  };

  return {
    railRef,
    canScrollPrev: state.canScrollPrev,
    canScrollNext: state.canScrollNext,
    scrollPrev: () => scrollByPage(-1),
    scrollNext: () => scrollByPage(1)
  };
}
