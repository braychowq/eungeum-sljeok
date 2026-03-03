import { LibraryEntry } from './types';
import styles from './InfoLibrarySection.module.css';

type InfoLibrarySectionProps = {
  entries: LibraryEntry[];
};

export default function InfoLibrarySection({ entries }: InfoLibrarySectionProps) {
  return (
    <section id="library" className={styles.section} aria-label="정보 창고">
      <div className={styles.headerRow}>
        <h3>슬쩍 정보 공유하기</h3>
      </div>

      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={entry.href}>
              <strong>{entry.title}</strong>
              <span>{entry.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
