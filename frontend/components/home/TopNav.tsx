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
      <div className={styles.brandCluster}>
        <Link className={styles.brandBlock} href="/">
          <span className={styles.brandEyebrow}>atelier bulletin</span>
          <span className={styles.logo}>은금슬쩍</span>
        </Link>
        <span className={styles.brandNote}>배우고, 연결하고, 판매까지 이어지는 makers&apos; daily flow</span>
      </div>

      <div className={styles.navTray}>
        <nav className={styles.nav} aria-label="메인 네비게이션">
          {items.map((item) => (
            <Link
              key={item.id}
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className={styles.alertButton} href="/community">
          <span className={styles.alertCount}>{String(Math.min(freshCount, 99)).padStart(2, '0')}</span>
          오늘의 새 소식
        </Link>
      </div>
    </header>
  );
}
