import Link from 'next/link';
import styles from './MobileBottomSheet.module.css';

type MobileBottomSheetProps = {
  activeMenu?: 'community' | 'market';
};

const menus = [
  { id: 'community', label: '커뮤니티', caption: '질문과 공유', href: '/community' },
  { id: 'market', label: '마켓', caption: '공방 탐색', href: '/market' }
] as const;

export default function MobileBottomSheet({
  activeMenu
}: MobileBottomSheetProps) {
  return (
    <aside className={styles.sheet} aria-label="모바일 탐색 도크">
      <div className={styles.sheetHeader}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.sheetCopy}>
          <span className={styles.sheetEyebrow}>sljeok dock</span>
          <strong>지금 필요한 흐름으로 이동</strong>
        </div>
      </div>

      <nav className={styles.menuRow} aria-label="하단 메뉴">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`${styles.menuLink} ${
              activeMenu === menu.id ? styles.menuLinkActive : ''
            }`}
            aria-current={activeMenu === menu.id ? 'page' : undefined}
          >
            <span className={styles.menuLabelRow}>
              <span className={styles.menuIndex} aria-hidden="true">
                {menu.id === 'community' ? '01' : '02'}
              </span>
              <span className={styles.menuLabel}>{menu.label}</span>
            </span>
            <span className={styles.menuCaption}>{menu.caption}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
