import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ProductChoiceCard.module.css';

type ProductChoiceCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  selected?: boolean;
  variant?: 'default' | 'metric';
  className?: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProductChoiceCard({
  eyebrow,
  title,
  description,
  selected = false,
  variant = 'default',
  className,
  type = 'button',
  ...props
}: ProductChoiceCardProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(styles.card, styles[variant], selected && styles.selected, className)}
    >
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <strong className={styles.title}>{title}</strong>
      {description ? <span className={styles.description}>{description}</span> : null}
    </button>
  );
}
