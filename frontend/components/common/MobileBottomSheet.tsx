import Link from 'next/link';
import styles from './MobileBottomSheet.module.css';

type DockMenu = 'home' | 'community' | 'market';

type MobileBottomSheetProps = {
  activeMenu?: DockMenu;
};

const menus = [
  { id: 'home', label: '홈', caption: '첫 화면', href: '/' },
  { id: 'community', label: '커뮤니티', caption: '질문과 공유', href: '/community' },
  { id: 'market', label: '마켓', caption: '공방 탐색', href: '/market' }
] as const;

export default function MobileBottomSheet({
  activeMenu
}: MobileBottomSheetProps) {
  const currentMenu = activeMenu ?? 'home';
  const currentSummary = {
    home: {
      eyebrow: 'sljeok dock',
      title: '홈에서 서비스 전체 흐름을 바로 여는 도크',
      description: '랜딩, 대화, 공방 탐색을 한 리듬으로 이어주는 모바일 네비게이션입니다.'
    },
    community: {
      eyebrow: 'community dock',
      title: '대화 흐름 안에서 바로 이동하는 도크',
      description: '현재 읽고 있는 커뮤니티 맥락을 잃지 않고 다른 핵심 흐름으로 넘어갈 수 있습니다.'
    },
    market: {
      eyebrow: 'market dock',
      title: '탐색과 등록을 같은 제품 톤으로 묶은 도크',
      description: '공방 비교 중에도 홈과 커뮤니티 흐름으로 부드럽게 다시 전환할 수 있습니다.'
    }
  }[currentMenu];

  return (
    <aside className={styles.sheet} aria-label="모바일 탐색 도크">
      <div className={styles.sheetHeader}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.sheetCopy}>
          <span className={styles.sheetEyebrow}>{currentSummary.eyebrow}</span>
          <strong>{currentSummary.title}</strong>
          <p>{currentSummary.description}</p>
        </div>
      </div>

      <nav className={styles.menuRow} aria-label="하단 메뉴">
        {menus.map((menu, index) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`${styles.menuLink} ${
              currentMenu === menu.id ? styles.menuLinkActive : ''
            }`}
            aria-current={currentMenu === menu.id ? 'page' : undefined}
          >
            <span className={styles.menuTopRow}>
              <span className={styles.menuIndex} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.menuState}>{currentMenu === menu.id ? 'Current' : 'Explore'}</span>
            </span>
            <strong className={styles.menuLabel}>{menu.label}</strong>
            <span className={styles.menuCaption}>{menu.caption}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
