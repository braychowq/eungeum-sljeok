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
      <Link className={styles.logo} href="/">
        silver-ly
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
        알림
      </button>
    </header>
  );
}
