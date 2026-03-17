'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProductLink } from '../common/ProductControl';
import { NavItem } from './types';
import styles from './TopNav.module.css';

type TopNavProps = {
  items: NavItem[];
  freshCount: number;
};

export default function TopNav({ items, freshCount }: TopNavProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <Link className={styles.brandBlock} href="/">
          <span className={styles.brandEyebrow}>silver atelier network</span>
          <span className={styles.logo}>은금슬쩍</span>
        </Link>

        <div className={styles.brandSignal}>
          <span className={styles.brandSignalLabel}>Today&apos;s dispatch</span>
          <strong className={styles.brandSignalValue}>새 대화 {freshCount}개가 이어지는 중</strong>
          <p className={styles.brandSignalNote}>
            질문에서 공간 탐색, 판매 액션까지 오늘 필요한 흐름을 한 번에 이어갈 수 있게 엮었습니다.
          </p>
        </div>
      </div>

      <div className={styles.navRow}>
        <nav className={styles.nav} aria-label="메인 네비게이션">
          {items.map((item, index) => (
            <ProductLink
              key={item.id}
              className={styles.navLink}
              href={item.href}
              tone="shell"
              variant={isActive(item.href) ? 'secondary' : 'ghost'}
              selected={isActive(item.href)}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <span className={styles.navIndex}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </ProductLink>
          ))}
        </nav>

        <ProductLink className={styles.alertButton} href="/community" tone="shell" variant="primary">
          <span className={styles.alertMeta}>오늘의 새 소식</span>
          <strong className={styles.alertCount}>
            {String(Math.min(freshCount, 99)).padStart(2, '0')}
          </strong>
          <span className={styles.alertArrow} aria-hidden="true">
            →
          </span>
        </ProductLink>
      </div>
    </header>
  );
}
