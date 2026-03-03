import Link from 'next/link';
import { marketCards, marketTabs, type MarketTabId } from './mockData';
import TwoMenuShell from './TwoMenuShell';
import styles from './MarketView.module.css';

type MarketViewProps = {
  activeTab: MarketTabId;
};

export default function MarketView({ activeTab }: MarketViewProps) {
  const cards = marketCards.filter(
    (card) => card.tab === activeTab && card.imageUrl.trim().length > 0
  );

  return (
    <TwoMenuShell
      activeMenu="market"
      title="슬쩍 마켓"
      subtitle="공방 쉐어하기 / 쥬얼리 악세사리 마켓"
      ctaLabel="+ 판매 등록"
      ctaHref="/market/new"
    >
      <section className={styles.tabSection} aria-label="마켓 소카테고리">
        <h2 className={styles.sectionTitle}>Categories</h2>
        <div className={styles.tabRow}>
          {marketTabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/market?tab=${tab.id}`}
              className={`${styles.tabButton} ${
                activeTab === tab.id ? styles.tabButtonActive : ''
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.listSection} aria-label="마켓 카드 목록">
        <h2 className={styles.sectionTitle}>All Patterns</h2>
        <p className={styles.listLabel}>카드 경계를 약화하고 섹션 박스를 제거한 그리드 스타일</p>
        <ul className={styles.cardGrid}>
          {cards.map((card) => (
            <li key={card.id}>
              <a className={styles.card} href={card.href}>
                <img src={card.imageUrl} alt={card.title} loading="lazy" />
                <div className={styles.cardBody}>
                  <strong>{card.title}</strong>
                  <span>보기</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </TwoMenuShell>
  );
}
