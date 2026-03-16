'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './types';
import styles from './TopNav.module.css';

type TopNavProps = {
  items: NavItem[];
};

export default function TopNav({ items }: TopNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={styles.header}>
      <Link className={styles.brandBlock} href="/">
        <span className={styles.brandEyebrow}>atelier network</span>
        <span className={styles.logo}>은금슬쩍</span>
      </Link>

      <nav className={styles.nav} aria-label="메인 네비게이션">
        {items.map((item) => (
          <Link
            key={item.id}
            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button className={styles.alertButton} type="button">
        <span className={styles.alertDot} aria-hidden="true" />
        새 소식
      </button>
    </header>
  );
}
