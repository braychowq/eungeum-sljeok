import Link from 'next/link';
import styles from './MobileBottomSheet.module.css';

type MobileBottomSheetProps = {
  activeMenu?: 'community' | 'market';
};

const menus = [
  { id: 'community', label: '커뮤니티', href: '/community' },
  { id: 'market', label: '마켓', href: '/market' }
] as const;

export default function MobileBottomSheet({
  activeMenu
}: MobileBottomSheetProps) {
  return (
    <aside className={styles.sheet} aria-label="모바일 바텀시트">
      <div className={styles.handle} aria-hidden="true" />

      <nav className={styles.menuRow} aria-label="하단 메뉴">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`${styles.menuLink} ${
              activeMenu === menu.id ? styles.menuLinkActive : ''
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
