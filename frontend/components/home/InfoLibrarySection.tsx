import Link from 'next/link';
import { LibraryEntry } from './types';
import styles from './InfoLibrarySection.module.css';

type InfoLibrarySectionProps = {
  entries: LibraryEntry[];
};

export default function InfoLibrarySection({ entries }: InfoLibrarySectionProps) {
  const featuredEntry = entries[0];
  const secondaryEntries = entries.slice(1);

  return (
    <section id="library" className={styles.section} aria-label="정보 창고">
      <div className={styles.sectionShell}>
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

          <Link href="/community?tab=share" className={styles.headerCta}>
            자료 더 보기
          </Link>
        </div>

        <div className={styles.layout}>
          {featuredEntry ? (
            <a href={featuredEntry.href} className={styles.featuredEntry}>
              <span className={styles.featuredLabel}>Editor&apos;s pick</span>
              <strong>{featuredEntry.title}</strong>
              <p>{featuredEntry.meta}</p>
              <span className={styles.entryAction}>대표 가이드 열람</span>
            </a>
          ) : null}

          <ul className={styles.list}>
            {secondaryEntries.map((entry) => (
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
        </div>
      </div>
    </section>
  );
}
