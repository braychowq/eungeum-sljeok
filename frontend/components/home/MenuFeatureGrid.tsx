import { MenuFeature } from './types';
import styles from './MenuFeatureGrid.module.css';

type MenuFeatureGridProps = {
  items: MenuFeature[];
};

export default function MenuFeatureGrid({ items }: MenuFeatureGridProps) {
  return (
    <section className={styles.section} aria-label="메뉴별 제공 기능">
      <div className={styles.headerRow}>
        <h2>메뉴별 제공 기능</h2>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.card}>
            <h3>{item.menu}</h3>
            <p className={styles.feature}>{item.feature}</p>
            <p className={styles.value}>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
