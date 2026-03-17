import { ProductButton } from './ProductControl';
import styles from './ProductRail.module.css';

type ProductRailProps = {
  label: string;
  summary?: string;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProductRail({
  label,
  summary,
  canScrollPrev,
  canScrollNext,
  onPrev,
  onNext,
  className
}: ProductRailProps) {
  return (
    <div className={cn(styles.control, className)} aria-label={`${label} 이동`}>
      {summary ? <span className={styles.summary}>{summary}</span> : null}

      <div className={styles.actions}>
        <ProductButton
          type="button"
          tone="neutral"
          variant="secondary"
          size="sm"
          iconOnly
          className={styles.button}
          onClick={onPrev}
          disabled={!canScrollPrev}
          aria-label={`${label} 이전`}
        >
          ←
        </ProductButton>
        <ProductButton
          type="button"
          tone="neutral"
          variant="secondary"
          size="sm"
          iconOnly
          className={styles.button}
          onClick={onNext}
          disabled={!canScrollNext}
          aria-label={`${label} 다음`}
        >
          →
        </ProductButton>
      </div>
    </div>
  );
}
