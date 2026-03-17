import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import styles from './ProductEditorialCard.module.css';

type ProductEditorialCardTone = 'neutral' | 'warm' | 'forest';
type ProductEditorialCardLayout = 'stacked' | 'split' | 'text';

type ProductEditorialCardSharedProps = {
  tone?: ProductEditorialCardTone;
  layout?: ProductEditorialCardLayout;
  compact?: boolean;
  media?: ReactNode;
  badge?: ReactNode;
  eyebrow?: ReactNode;
  heading: ReactNode;
  description?: ReactNode;
  signals?: ReactNode;
  stats?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

type ProductEditorialCardLinkProps = ProductEditorialCardSharedProps &
  Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'media'> & {
    href: ComponentProps<typeof Link>['href'];
  };

type ProductEditorialCardPanelProps = ProductEditorialCardSharedProps &
  Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'> & {
    as?: 'article' | 'div' | 'section';
    href?: undefined;
  };

type ProductEditorialCardProps = ProductEditorialCardLinkProps | ProductEditorialCardPanelProps;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

const toneClassName: Record<ProductEditorialCardTone, string> = {
  neutral: styles.neutralTone,
  warm: styles.warmTone,
  forest: styles.forestTone
};

const layoutClassName: Record<ProductEditorialCardLayout, string> = {
  stacked: styles.layoutStacked,
  split: styles.layoutSplit,
  text: styles.layoutText
};

export default function ProductEditorialCard({
  tone = 'neutral',
  layout = 'stacked',
  compact = false,
  media,
  badge,
  eyebrow,
  heading,
  description,
  signals,
  stats,
  footer,
  className,
  bodyClassName,
  ...props
}: ProductEditorialCardProps) {
  const hasMedia = Boolean(media);
  const cardClassName = cn(
    styles.card,
    toneClassName[tone],
    layoutClassName[layout],
    compact && styles.compact,
    className
  );

  const content = (
    <>
      {hasMedia ? (
        <div className={styles.media}>
          {media}
          {badge ? <span className={styles.mediaBadge}>{badge}</span> : null}
        </div>
      ) : null}

      <div className={cn(styles.body, !hasMedia && styles.noMedia, bodyClassName)}>
        {!hasMedia && badge ? <span className={styles.bodyBadge}>{badge}</span> : null}

        <div className={styles.copy}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <strong className={styles.heading}>{heading}</strong>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        {signals ? <div className={styles.signals}>{signals}</div> : null}
        {stats ? <div className={styles.stats}>{stats}</div> : null}
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </>
  );

  if ('href' in props && props.href !== undefined) {
    return (
      <Link {...props} className={cardClassName}>
        {content}
      </Link>
    );
  }

  const { as: Panel = 'article', ...panelProps } = props;

  return (
    <Panel {...panelProps} className={cardClassName}>
      {content}
    </Panel>
  );
}
