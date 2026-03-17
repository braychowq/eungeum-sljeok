'use client';

import { usePathname } from 'next/navigation';
import { ProductLink } from '../common/ProductControl';
import ProductFeatureBand from '../common/ProductFeatureBand';
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

  return (
    <header className={styles.header}>
      <ProductFeatureBand
        title="은금슬쩍"
        titleAs="h2"
        eyebrow="Atelier dispatch"
        description="배우고, 연결하고, 판매까지 이어지는 silver atelier network"
        meta={
          <div className={styles.metaRow}>
            <span className={styles.signalPill}>
              <span className={styles.signalLabel}>Live</span>
              <strong>오늘 반응 중인 대화 {freshCount}개</strong>
            </span>
            <span className={styles.signalPill}>
              <span className={styles.signalLabel}>Now guiding</span>
              <strong>{activeContext?.note ?? '오늘의 흐름을 먼저 고르는 홈 스테이지'}</strong>
            </span>
          </div>
        }
        action={
          <div className={styles.actionRow}>
            <nav className={styles.nav} aria-label="메인 네비게이션">
              {items.map((item) => {
                const active = isActive(item.href);
                const routeContext = routeContextMap[item.id as keyof typeof routeContextMap];

                return (
                  <ProductLink
                    key={item.id}
                    href={item.href}
                    tone={active ? routeContext?.tone ?? 'neutral' : 'shell'}
                    variant={active ? 'primary' : 'ghost'}
                    selected={active}
                    className={styles.navLink}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={styles.navEyebrow}>{routeContext?.eyebrow ?? 'Flow'}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                    <span className={styles.navNote}>
                      {routeContext?.note ?? '오늘의 흐름을 고르는 경로'}
                    </span>
                  </ProductLink>
                );
              })}
            </nav>

            <ProductLink
              href="/community"
              tone="warm"
              variant="primary"
              className={styles.alertLink}
            >
              <span className={styles.alertMeta}>Today&apos;s dispatch</span>
              <strong className={styles.alertCount}>
                {String(Math.min(freshCount, 99)).padStart(2, '0')}
              </strong>
              <span className={styles.alertNote}>새 글이 가장 먼저 쌓이는 대화 흐름</span>
            </ProductLink>
          </div>
        }
        compact
        className={styles.headerBand}
      />
    </header>
  );
}
