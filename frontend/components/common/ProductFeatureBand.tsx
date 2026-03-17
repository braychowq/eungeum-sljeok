import type { ReactNode } from 'react';
import styles from './ProductFeatureBand.module.css';

type ProductFeatureBandTone = 'neutral' | 'warm' | 'forest';

type ProductFeatureBandProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  tone?: ProductFeatureBandTone;
  titleAs?: 'h1' | 'h2' | 'h3';
  compact?: boolean;
  className?: string;
  bodyClassName?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProductFeatureBand({
  eyebrow,
  title,
  description,
  meta,
  action,
  children,
  tone = 'neutral',
  titleAs = 'h2',
  compact = false,
  className,
  bodyClassName
}: ProductFeatureBandProps) {
  const HeadingTag = titleAs;

  return (
    <div
      className={cn(
        styles.band,
        styles[`${tone}Tone`],
        action ? styles.withAction : undefined,
        compact ? styles.compact : undefined,
        className
      )}
    >
      <div className={styles.header}>
        <div className={styles.copy}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <div className={styles.copyStack}>
            <HeadingTag className={styles.title}>{title}</HeadingTag>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </div>

        {action ? <div className={styles.action}>{action}</div> : null}
      </div>

      {children ? <div className={cn(styles.body, bodyClassName)}>{children}</div> : null}
    </div>
  );
}
