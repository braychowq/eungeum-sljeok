import Link from 'next/link';
import MobileBottomSheet from '../common/MobileBottomSheet';
import SiteFooter from '../common/SiteFooter';
import styles from './TwoMenuShell.module.css';

type TwoMenuShellProps = {
  activeMenu: 'community' | 'market';
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  hideHero?: boolean;
  hideEyebrow?: boolean;
  hideCta?: boolean;
  children: React.ReactNode;
};

const mainMenus = [
  { id: 'home', label: '홈', caption: '메인 런웨이', href: '/' },
  { id: 'community', label: '슬쩍 커뮤니티', caption: '질문과 공유', href: '/community' },
  { id: 'market', label: '공방 쉐어', caption: '공간 탐색', href: '/market' }
] as const;

const shellStory = {
  community: {
    headerDescription: '질문, 공유, 상세, 작성 화면이 하나의 제품 캔버스에서 이어집니다.',
    statusLabel: "Today's route",
    statusValue: '질문 → 맥락 파악 → 답변',
    contextEyebrow: 'Maker conversation',
    contextDescription:
      '지금 필요한 대화 흐름으로 바로 들어가고, 상세와 작성 화면까지 같은 제품 톤으로 이어집니다.',
    heroEyebrow: 'Community view',
    heroDescription:
      '탭 분위기와 작성 동선을 같은 캔버스에 묶어 관리자형 게시판보다 사람 사이의 대화 흐름이 먼저 읽히게 정리했습니다.',
    highlights: [
      {
        label: 'Flow cue',
        title: '상황과 시도한 내용을 먼저',
        description: '질문과 공유의 맥락을 앞에 두어 반응이 더 빨리 붙도록 만듭니다.'
      },
      {
        label: 'Writing cue',
        title: '답변을 부르는 끝맺음',
        description: '마지막 요청 문장을 선명하게 보여줘 다음 대화가 자연스럽게 이어집니다.'
      }
    ],
    ledger: [
      { label: 'Product line', value: '탐색 → 상세 → 작성' },
      { label: 'Audience', value: '질문과 공유를 오가는 메이커' }
    ]
  },
  market: {
    headerDescription: '공방 탐색, 상세, 등록 화면이 하나의 제품 캔버스에서 이어집니다.',
    statusLabel: "Today's route",
    statusValue: '탐색 → 비교 → 문의',
    contextEyebrow: 'Studio share',
    contextDescription:
      '공방 감도와 운영 조건, 문의 흐름을 같은 제품 리듬으로 이어 지금 필요한 공간을 더 빠르게 고르게 합니다.',
    heroEyebrow: 'Market view',
    heroDescription:
      '가격과 조건만 나열하는 툴이 아니라 공간 감도와 운영 톤이 먼저 읽히고, 문의까지 같은 흐름으로 이어지게 정리했습니다.',
    highlights: [
      {
        label: 'Atmosphere first',
        title: '공간 무드가 먼저',
        description: '가격표보다 먼저 공간의 결을 읽어 내 작업과 맞는지 빠르게 판단할 수 있습니다.'
      },
      {
        label: 'Host cue',
        title: '운영 톤을 바로 파악',
        description: '응답 방식과 사용 리듬을 한 번에 보여줘 비교와 문의 사이의 왕복을 줄입니다.'
      }
    ],
    ledger: [
      { label: 'Product line', value: '탐색 → 상세 → 등록' },
      { label: 'Audience', value: '공방을 찾는 메이커와 팀' }
    ]
  }
} as const;

export default function TwoMenuShell({
  activeMenu,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  hideHero = false,
  hideEyebrow = false,
  hideCta = false,
  children
}: TwoMenuShellProps) {
  const isMarket = activeMenu === 'market';
  const showHeaderAction = hideHero || hideCta;
  const story = shellStory[activeMenu];
  const leadDescription = subtitle ?? story.contextDescription;

  return (
    <main className={`${styles.page} ${isMarket ? styles.marketPage : ''}`}>
      <div className={styles.container}>
        <header className={styles.topNav}>
          <Link href="/" className={styles.brandBlock}>
            <span className={styles.brandEyebrow}>atelier network</span>
            <span className={styles.logo}>은금슬쩍</span>
          </Link>

          <nav className={styles.mainMenu} aria-label="대메뉴">
            {mainMenus.map((menu) => {
              const isActive = activeMenu === menu.id;

              return (
                <Link
                  key={menu.id}
                  href={menu.href}
                  className={`${styles.mainMenuLink} ${isActive ? styles.mainMenuLinkActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.mainMenuText}>
                    <span className={styles.mainMenuLabel}>{menu.label}</span>
                    <span className={styles.mainMenuCaption}>{menu.caption}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.utilityCluster}>
            <div className={styles.headerStatus}>
              <span className={styles.headerStatusLabel}>{story.statusLabel}</span>
              <strong>{story.statusValue}</strong>
              <p>{story.headerDescription}</p>
            </div>

            {showHeaderAction ? (
              <Link href={ctaHref} className={styles.headerAction}>
                {ctaLabel}
              </Link>
            ) : (
              <div className={styles.alertButton}>
                <span className={styles.alertDot} aria-hidden="true" />
                새 흐름
              </div>
            )}
          </div>
        </header>

        {hideHero ? (
          <section className={styles.contextStrip} aria-label={`${title} 페이지 소개`}>
            <div className={styles.contextCopy}>
              <span className={styles.contextEyebrow}>{story.contextEyebrow}</span>
              <strong>{title}</strong>
              <p>{leadDescription}</p>
            </div>

            <div className={styles.contextSignals}>
              {story.ledger.map((item) => (
                <div key={`${activeMenu}-${item.label}`} className={styles.contextSignal}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            {!hideCta ? (
              <Link href={ctaHref} className={styles.contextAction}>
                {ctaLabel}
              </Link>
            ) : null}
          </section>
        ) : (
          <section className={styles.heroBox} aria-label={`${title} 소개`}>
            <div className={styles.heroIntro}>
              {!hideEyebrow ? <p className={styles.eyebrow}>{story.heroEyebrow}</p> : null}
              <h1 className={styles.pageTitle}>{title}</h1>
              <p className={styles.pageSubtitle}>{leadDescription}</p>

              <div className={styles.heroActionRow}>
                {!hideCta ? (
                  <Link href={ctaHref} className={styles.ctaButton}>
                    {ctaLabel}
                  </Link>
                ) : null}
                <p className={styles.heroCaption}>{story.heroDescription}</p>
              </div>

              <div className={styles.heroLedger}>
                {story.ledger.map((item) => (
                  <div key={`${activeMenu}-hero-${item.label}`} className={styles.heroLedgerItem}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.heroMetaLead}>
                <span className={styles.heroMetaLabel}>{story.statusLabel}</span>
                <strong>{story.statusValue}</strong>
                <p>{story.headerDescription}</p>
              </div>

              <div className={styles.heroSignalGrid}>
                {story.highlights.map((item) => (
                  <div key={`${activeMenu}-${item.title}`} className={styles.heroSignalItem}>
                    <span>{item.label}</span>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className={styles.content}>{children}</div>

        <SiteFooter />
      </div>

      <MobileBottomSheet activeMenu={activeMenu} />
    </main>
  );
}
