'use client';

import { usePathname } from 'next/navigation';
import { ProductLink } from '../common/ProductControl';
import { NavItem } from './types';
import styles from './TopNav.module.css';

type TopNavProps = {
  items: NavItem[];
  freshCount: number;
};

const routeContextMap = {
  community: {
    eyebrow: 'Talk',
    note: '질문과 공유로 오늘의 막힘을 먼저 푸는 흐름',
    tone: 'warm'
  },
  market: {
    eyebrow: 'Browse',
    note: '공방 쉐어와 판매 액션을 이어 보는 흐름',
    tone: 'forest'
  }
} as const;

export default function TopNav({ items, freshCount }: TopNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const activeItem = items.find((item) => isActive(item.href)) ?? items[0];
  const activeContext = activeItem
    ? routeContextMap[activeItem.id as keyof typeof routeContextMap]
    : undefined;
  const liveLabel = `24h 새 대화 ${freshCount}개`;

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <div className={styles.brandRow}>
              <div className={styles.brandCopy}>
                <span className={styles.brandEyebrow}>Silver atelier network</span>
                <h2 className={styles.brand}>은금슬쩍</h2>
              </div>

              <span className={styles.signalChip}>
                <span className={styles.signalLabel}>Live</span>
                <strong className={styles.signalValue}>{liveLabel}</strong>
              </span>
            </div>

            <p className={styles.brandDescription}>
              배우고, 연결하고, 판매까지 이어지는 silver atelier network
            </p>
          </div>

          <div className={styles.activePanel}>
            <span className={styles.activeEyebrow}>{activeContext?.eyebrow ?? 'Home flow'}</span>
            <strong className={styles.activeTitle}>{activeItem?.label ?? '슬쩍 커뮤니티'}</strong>
            <p className={styles.activeNote}>
              {activeContext?.note ?? '오늘의 흐름을 먼저 고르는 홈 스테이지'}
            </p>
          </div>
        </div>

        <nav className={styles.nav} aria-label="메인 네비게이션">
          {items.map((item) => {
            const active = isActive(item.href);
            const routeContext = routeContextMap[item.id as keyof typeof routeContextMap];

            return (
              <ProductLink
                key={item.id}
                href={item.href}
                tone={active ? routeContext?.tone ?? 'neutral' : 'shell'}
                variant={active ? 'secondary' : 'ghost'}
                selected={active}
                className={styles.navTab}
                aria-current={active ? 'page' : undefined}
              >
                <span className={styles.navTone}>{routeContext?.eyebrow ?? 'Flow'}</span>
                <span className={styles.navLabel}>{item.label}</span>
              </ProductLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
