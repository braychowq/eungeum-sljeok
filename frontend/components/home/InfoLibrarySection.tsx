import Link from 'next/link';
import HomeSectionFrame from './HomeSectionFrame';
import { LibraryEntry } from './types';
import styles from './InfoLibrarySection.module.css';

type InfoLibrarySectionProps = {
  entries: LibraryEntry[];
  sequence: string;
};

export default function InfoLibrarySection({ entries, sequence }: InfoLibrarySectionProps) {
  const featuredEntry = entries[0];
  const secondaryEntries = entries.slice(1);

  return (
    <section id="library" className={styles.section} aria-label="정보 창고">
      <HomeSectionFrame
        index={sequence}
        eyebrow="Info archive"
        tone="gold"
        title={
          <Link href="/community?tab=share" className={styles.headerLink}>
            <span className={styles.headerTitle}>슬쩍 정보 공유하기</span>
          </Link>
        }
        description="초보 제작자 체크리스트부터 운영 템플릿까지, 다시 꺼내 보기 좋은 자료를 정리했습니다."
        aside={
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Archive cut</span>
            <strong>{entries.length}개 자료 아카이브</strong>
            <p>
              {featuredEntry
                ? `${featuredEntry.title}부터 운영 템플릿까지, 다시 열람하기 좋은 자료만 한 흐름으로 모았습니다.`
                : '다시 꺼내 보기 좋은 제작 자료를 차곡차곡 모으고 있습니다.'}
            </p>
            {featuredEntry ? (
              <div className={styles.summaryMeta}>
                <span>Lead guide</span>
                <strong>{featuredEntry.meta}</strong>
              </div>
            ) : null}
          </div>
        }
      >
        <div className={styles.toolbar}>
          <Link href="/community?tab=share" className={styles.headerCta}>
            자료 더 보기
          </Link>
          <span className={styles.archiveStatus}>실무 자료 {entries.length}선</span>
        </div>

        <div className={styles.layout}>
          {featuredEntry ? (
            <Link href={featuredEntry.href} className={styles.featuredEntry}>
              <div className={styles.featuredTop}>
                <span className={styles.featuredLabel}>Editor&apos;s pick</span>
                <span className={styles.featuredIndex}>01</span>
              </div>
              <strong>{featuredEntry.title}</strong>
              <p>{featuredEntry.meta}</p>
              <span className={styles.entryAction}>대표 가이드 열람</span>
            </Link>
          ) : null}

          <ul className={styles.list}>
            {secondaryEntries.map((entry, index) => (
              <li key={entry.id}>
                <Link href={entry.href}>
                  <span className={styles.entryIndex}>{String(index + 2).padStart(2, '0')}</span>
                  <div className={styles.entryCopy}>
                    <strong>{entry.title}</strong>
                    <span>{entry.meta}</span>
                  </div>
                  <span className={styles.entryAction}>열람</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </HomeSectionFrame>
    </section>
  );
}
