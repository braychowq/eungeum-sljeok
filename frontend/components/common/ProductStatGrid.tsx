import type { CSSProperties } from 'react';
import styles from './ProductStatGrid.module.css';

export type ProductStatGridItem = {
  label: string;
  value: string;
  description?: string;
  emphasis?: 'default' | 'accent' | 'support' | 'warm';
};

type ProductStatGridProps = {
  items: ProductStatGridItem[];
  columns?: 1 | 2 | 3;
  mobileColumns?: 1 | 2 | 3;
  size?: 'md' | 'sm';
  ariaLabel?: string;
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

const emphasisClassName: Record<NonNullable<ProductStatGridItem['emphasis']>, string> = {
  default: '',
  accent: styles.accent,
  support: styles.support,
  warm: styles.warm
};

export default function ProductStatGrid({
  items,
  columns = 3,
  mobileColumns = columns,
  size = 'md',
  ariaLabel,
  className
}: ProductStatGridProps) {
  return (
    <div
      className={cn(styles.grid, size === 'sm' ? styles.sizeSm : styles.sizeMd, className)}
      aria-label={ariaLabel}
      style={
        {
          '--product-stat-columns': columns,
          '--product-stat-columns-mobile': mobileColumns
        } as CSSProperties
      }
    >
      {items.map((item, index) => (
        <article
          key={`${item.label}-${item.value}-${index}`}
          className={cn(styles.card, emphasisClassName[item.emphasis ?? 'default'])}
        >
          <span className={styles.label}>{item.label}</span>
          <strong className={styles.value}>{item.value}</strong>
          {item.description ? <p className={styles.description}>{item.description}</p> : null}
        </article>
      ))}
    </div>
  );
}
