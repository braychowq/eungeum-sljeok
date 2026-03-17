import { ProductButton } from './ProductControl';
import styles from './ProductPager.module.css';

type ProductPagerItem = {
  id: string;
  srLabel?: string;
};

type ProductPagerProps = {
  label: string;
  activeIndex: number;
  total: number;
  summary?: string;
  items?: ProductPagerItem[];
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProductPager({
  label,
  activeIndex,
  total,
  summary,
  items,
  onSelect,
  onPrev,
  onNext,
  className
}: ProductPagerProps) {
  const pagerItems =
    items && items.length > 0
      ? items
      : Array.from({ length: total }, (_, index) => ({
          id: `${label}-${index}`,
          srLabel: `${index + 1}번 ${label}`
        }));
  const isSingle = total <= 1;

  return (
    <div className={cn(styles.pager, className)} aria-label={`${label} 페이지 제어`}>
      {summary ? (
        <div className={styles.summaryBlock}>
          <span className={styles.summaryLabel}>Now showing</span>
          <strong className={styles.summary}>{summary}</strong>
        </div>
      ) : null}

      <div className={styles.centerRail}>
        <div className={styles.dots} role="tablist" aria-label={`${label} 페이지네이션`}>
          {pagerItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={item.srLabel ?? `${index + 1}번 ${label}`}
              className={cn(styles.dot, index === activeIndex && styles.activeDot)}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>

        <span className={styles.counter} aria-live="polite">
          {total > 0 ? `${activeIndex + 1} / ${total}` : '0 / 0'}
        </span>
      </div>

      <div className={styles.actions}>
        <ProductButton
          type="button"
          tone="shell"
          variant="secondary"
          size="sm"
          iconOnly
          className={styles.button}
          onClick={onPrev}
          disabled={isSingle}
          aria-label={`${label} 이전`}
        >
          ←
        </ProductButton>
        <ProductButton
          type="button"
          tone="shell"
          variant="secondary"
          size="sm"
          iconOnly
          className={styles.button}
          onClick={onNext}
          disabled={isSingle}
          aria-label={`${label} 다음`}
        >
          →
        </ProductButton>
      </div>
    </div>
  );
}
