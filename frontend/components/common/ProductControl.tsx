import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import styles from './ProductControl.module.css';

type ProductControlTone = 'neutral' | 'warm' | 'forest' | 'shell';
type ProductControlVariant = 'primary' | 'secondary' | 'ghost';
type ProductControlSize = 'md' | 'sm';

type ProductControlSharedProps = {
  children: ReactNode;
  tone?: ProductControlTone;
  variant?: ProductControlVariant;
  size?: ProductControlSize;
  iconOnly?: boolean;
  className?: string;
};

export type ProductLinkProps = Omit<ComponentProps<typeof Link>, 'className'> &
  ProductControlSharedProps;

export type ProductButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ProductControlSharedProps;

const toneClassName: Record<ProductControlTone, string> = {
  neutral: styles.neutralTone,
  warm: styles.warmTone,
  forest: styles.forestTone,
  shell: styles.shellTone
};

const variantClassName: Record<ProductControlVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost
};

const sizeClassName: Record<ProductControlSize, string> = {
  md: styles.sizeMd,
  sm: styles.sizeSm
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function getClassName({
  tone = 'neutral',
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className
}: Omit<ProductControlSharedProps, 'children'>) {
  return cn(
    styles.control,
    toneClassName[tone],
    variantClassName[variant],
    sizeClassName[size],
    iconOnly && styles.iconOnly,
    className
  );
}

export function ProductLink({
  tone = 'neutral',
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className,
  children,
  ...props
}: ProductLinkProps) {
  return (
    <Link
      {...props}
      className={getClassName({ tone, variant, size, iconOnly, className })}
    >
      {children}
    </Link>
  );
}

export function ProductButton({
  tone = 'neutral',
  variant = 'secondary',
  size = 'md',
  iconOnly = false,
  className,
  children,
  ...props
}: ProductButtonProps) {
  return (
    <button
      {...props}
      className={getClassName({ tone, variant, size, iconOnly, className })}
    >
      {children}
    </button>
  );
}
