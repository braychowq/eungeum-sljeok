'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      <div className={styles.brandColumn}>
        <div className={styles.brandMetaRow}>
          <span className={styles.dispatchTag}>atelier edition</span>
          <span className={styles.dispatchMeta}>오늘 반응 중인 대화 {freshCount}개</span>
        </div>

        <div className={styles.brandCluster}>
          <Link className={styles.brandBlock} href="/">
            <span className={styles.brandEyebrow}>silver atelier network</span>
            <span className={styles.logo}>은금슬쩍</span>
          </Link>
          <span className={styles.brandNote}>
            배우고, 연결하고, 판매까지 이어지는 makers&apos; daily flow
          </span>
        </div>
      </div>

      <div className={styles.navTray}>
        <nav className={styles.nav} aria-label="메인 네비게이션">
          {items.map((item, index) => (
            <Link
              key={item.id}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              <span className={styles.navIndex}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <Link className={styles.alertButton} href="/community">
          <span className={styles.alertMeta}>오늘의 새 소식</span>
          <strong className={styles.alertCount}>
            {String(Math.min(freshCount, 99)).padStart(2, '0')}
          </strong>
          <span className={styles.alertArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </header>
  );
}
