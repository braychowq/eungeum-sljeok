import Link from 'next/link';
import ProductEditorialCard from '../common/ProductEditorialCard';
import ProductFeatureBand from '../common/ProductFeatureBand';
import { ProductLink } from '../common/ProductControl';
import ProductStatGrid from '../common/ProductStatGrid';
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
          <ProductFeatureBand
            eyebrow="Archive cut"
            title={`${entries.length}개 자료 아카이브`}
            description={
              featuredEntry
                ? `${featuredEntry.title}부터 운영 템플릿까지, 다시 열람하기 좋은 자료만 한 흐름으로 모았습니다.`
                : '다시 꺼내 보기 좋은 제작 자료를 차곡차곡 모으고 있습니다.'
            }
            tone="warm"
            compact
            className={styles.summaryBand}
            bodyClassName={styles.summaryBandBody}
          >
            <ProductStatGrid
              items={[
                {
                  label: 'Lead guide',
                  value: featuredEntry ? '대표 가이드' : '준비 중',
                  description: featuredEntry?.meta ?? '첫 자료가 준비되는 중입니다.',
                  emphasis: 'warm'
                },
                {
                  label: 'Archive flow',
                  value: `${secondaryEntries.length}개 후속 자료`,
                  description: '체크리스트, 운영 노트, 템플릿을 한 흐름으로 정리했습니다.',
                  emphasis: 'accent'
                }
              ]}
              columns={2}
              size="sm"
              ariaLabel="정보 공유 자료 요약"
              className={styles.summaryGrid}
            />
          </ProductFeatureBand>
        }
      >
        <div className={styles.toolbar}>
          <ProductLink
            href="/community?tab=share"
            tone="warm"
            variant="primary"
            size="sm"
            className={styles.headerCta}
          >
            자료 더 보기
          </ProductLink>
          <span className={styles.archiveStatus}>실무 자료 {entries.length}선</span>
        </div>

        <div className={styles.layout}>
          {featuredEntry ? (
            <ProductEditorialCard
              href={featuredEntry.href}
              tone="warm"
              layout="text"
              badge="Editor's pick"
              eyebrow={`Archive ${sequence}`}
              heading={<span className={styles.featuredTitle}>{featuredEntry.title}</span>}
              description={`${featuredEntry.meta} · 대표 가이드부터 운영 템플릿까지 다시 꺼내 보기 좋은 흐름으로 묶었습니다.`}
              signals={
                <div className={styles.entrySignals}>
                  <span className={styles.signalChip}>대표 가이드</span>
                  <span className={styles.signalChip}>실무 참고</span>
                </div>
              }
              footer={
                <div className={styles.cardFooter}>
                  <span className={styles.footerMeta}>{featuredEntry.meta}</span>
                  <span className={styles.footerAction}>대표 가이드 열람</span>
                </div>
              }
              className={styles.featuredEntry}
            />
          ) : null}

          <div className={styles.list}>
            {secondaryEntries.map((entry, index) => (
              <ProductEditorialCard
                key={entry.id}
                href={entry.href}
                tone={index % 2 === 0 ? 'neutral' : 'warm'}
                layout="text"
                compact
                badge={String(index + 2).padStart(2, '0')}
                eyebrow="Archive note"
                heading={<span className={styles.entryTitle}>{entry.title}</span>}
                description={entry.meta}
                footer={
                  <div className={styles.cardFooter}>
                    <span className={styles.footerMeta}>{`자료 ${String(index + 2).padStart(2, '0')}`}</span>
                    <span className={styles.footerAction}>열람</span>
                  </div>
                }
                className={styles.listCard}
              />
            ))}
          </div>
        </div>
      </HomeSectionFrame>
    </section>
  );
}
