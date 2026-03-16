import Link from 'next/link';
import styles from './EditorialSelectionDeck.module.css';

export type EditorialSelectionDeckTheme = 'warm' | 'forest';

export type EditorialSelectionDeckSignal = {
  label: string;
  value: string;
  detail: string;
};

export type EditorialSelectionDeckItem = {
  id: string;
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  badge?: string;
  isActive?: boolean;
};

type EditorialSelectionDeckProps = {
  theme?: EditorialSelectionDeckTheme;
  eyebrow: string;
  title: string;
  description: string;
  signals: EditorialSelectionDeckSignal[];
  items: EditorialSelectionDeckItem[];
  action?: {
    href: string;
    label: string;
    onClick?: () => void;
  };
  ariaLabel: string;
};

export default function EditorialSelectionDeck({
  theme = 'warm',
  eyebrow,
  title,
  description,
  signals,
  items,
  action,
  ariaLabel
}: EditorialSelectionDeckProps) {
  return (
    <section
      className={`${styles.shell} ${theme === 'forest' ? styles.forestShell : styles.warmShell}`}
      aria-label={ariaLabel}
    >
      <div className={styles.summaryBand}>
        <div className={styles.copyBlock}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <div className={styles.copyStack}>
            <div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>
            </div>

            {action ? (
              <Link href={action.href} className={styles.actionLink} onClick={action.onClick}>
                {action.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className={styles.signalRow} aria-label={`${title} 요약`}>
          {signals.map((signal) => (
            <div key={signal.label} className={styles.signalCard}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <p>{signal.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <nav className={styles.cardGrid} aria-label={ariaLabel}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${styles.card} ${item.isActive ? styles.cardActive : ''}`}
            aria-current={item.isActive ? 'page' : undefined}
          >
            <div className={styles.cardTop}>
              <span className={styles.cardEyebrow}>{item.eyebrow ?? item.title}</span>
              {item.badge ? <span className={styles.cardBadge}>{item.badge}</span> : null}
            </div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <div className={styles.cardMetaRow}>
              {item.meta ? <span className={styles.cardMeta}>{item.meta}</span> : <span className={styles.cardMeta}>지금 흐름 정리</span>}
              <span className={styles.cardAction}>{item.isActive ? '현재 선택' : '이 흐름 보기'}</span>
            </div>
          </Link>
        ))}
      </nav>
    </section>
  );
}
