import type { ReactNode } from 'react';
import styles from './ProductSectionHeader.module.css';

type ProductSectionHeaderTone = 'neutral' | 'warm' | 'forest';

type ProductSectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  meta?: ReactNode;
  tone?: ProductSectionHeaderTone;
  titleAs?: 'h1' | 'h2' | 'h3';
  compact?: boolean;
  className?: string;
};

function toClassName(parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export default function ProductSectionHeader({
  eyebrow,
  title,
  description,
  action,
  meta,
  tone = 'neutral',
  titleAs = 'h2',
  compact = false,
  className
}: ProductSectionHeaderProps) {
  const HeadingTag = titleAs;

  return (
    <header
      className={toClassName([
        styles.header,
        styles[`${tone}Tone`],
        action ? styles.withAction : '',
        compact ? styles.compact : '',
        className
      ])}
    >
      <div className={styles.copy}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <HeadingTag className={styles.title}>{title}</HeadingTag>
        {description ? <p className={styles.description}>{description}</p> : null}
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </div>

      {action ? <div className={styles.action}>{action}</div> : null}
    </header>
  );
}
