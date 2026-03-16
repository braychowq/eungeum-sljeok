import type { ReactNode } from 'react';
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
      <div className={styles.rail}>
        <span className={styles.index}>{index}</span>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>{eyebrow}</span>

          <div className={styles.headingBlock}>
            <div className={styles.title}>{title}</div>
            <p>{description}</p>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        {aside ? <div className={styles.aside}>{aside}</div> : null}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
