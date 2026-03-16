import Link from 'next/link';
import { LibraryEntry } from './types';
import styles from './InfoLibrarySection.module.css';

type InfoLibrarySectionProps = {
  entries: LibraryEntry[];
};

export default function InfoLibrarySection({ entries }: InfoLibrarySectionProps) {
  return (
    <section id="library" className={styles.section} aria-label="정보 창고">
      <div className={styles.headerRow}>
        <div className={styles.headerBlock}>
          <span className={styles.eyebrow}>Info archive</span>
          <h3 className={styles.heading}>
            <Link href="/community?tab=share" className={styles.headerLink}>
              <span className={styles.headerTitle}>슬쩍 정보 공유하기</span>
            </Link>
          </h3>
          <p className={styles.headerDescription}>
            초보 제작자 체크리스트부터 운영 템플릿까지, 다시 꺼내 보기 좋은 자료를 정리했습니다.
          </p>
        </div>
      </div>

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={entry.href}>
              <div className={styles.entryCopy}>
                <strong>{entry.title}</strong>
                <span>{entry.meta}</span>
              </div>
              <span className={styles.entryAction}>열람</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
