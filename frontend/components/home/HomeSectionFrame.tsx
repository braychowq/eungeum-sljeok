import type { ReactNode } from 'react';
import ProductSectionHeader from '../common/ProductSectionHeader';
import styles from './HomeSectionFrame.module.css';

type HomeSectionFrameProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  tone?: 'clay' | 'moss' | 'gold';
  aside?: ReactNode;
  children: ReactNode;
};

export default function HomeSectionFrame({
  index,
  eyebrow,
  title,
  description,
  tone = 'clay',
  aside,
  children
}: HomeSectionFrameProps) {
  return (
    <div className={styles.frame} data-tone={tone}>
      <div className={styles.intro}>
        <span className={styles.sequenceWatermark} aria-hidden="true">
          {index}
        </span>

        <div className={styles.metaRow}>
          <span className={styles.indexBadge}>Section {index}</span>
          <span className={styles.metaNote}>home product stage</span>
        </div>

        <div className={styles.headerGrid}>
          <ProductSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            className={styles.sectionHeader}
          />

          {aside ? <div className={styles.aside}>{aside}</div> : null}
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
