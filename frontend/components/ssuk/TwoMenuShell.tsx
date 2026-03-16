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
  { id: 'community', label: '슬쩍 커뮤니티', href: '/community' },
  { id: 'market', label: '공방 쉐어', href: '/market' }
] as const;

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
  const eyebrow = activeMenu === 'community' ? 'COMMUNITY VIEW' : 'MARKET VIEW';
  const isMarket = activeMenu === 'market';
  const showHeaderAction = hideHero || hideCta;
  const headerStatus = isMarket
    ? {
        label: '오늘의 연결',
        value: '탐색과 등록이 같은 제품 톤으로 이어집니다.'
      }
    : {
        label: '오늘의 흐름',
        value: '질문과 공유가 같은 리듬으로 이어집니다.'
      };
  const heroStatus = isMarket
    ? {
        label: 'Registration Note',
        value: '운영 톤과 공간 감도가 먼저 읽히는 등록 흐름',
        description: '가격과 조건만 쌓는 관리 화면이 아니라, 들어오자마자 공간 경험이 느껴지는 소개 흐름으로 맞췄습니다.'
      }
    : {
        label: 'Writing Note',
        value: '답변과 공감이 붙는 맥락 중심의 작성 흐름',
        description: '탭 분위기와 체크리스트를 한 캔버스에 묶어, 게시판 입력 폼이 아니라 읽히는 글을 만드는 흐름으로 정리했습니다.'
      };
  const heroHighlights = isMarket
    ? [
        {
          label: 'Intro direction',
          title: '공간 무드가 먼저',
          description: '위치와 가격보다 어떤 작업자가 잘 맞는 공간인지 먼저 보여줍니다.'
        },
        {
          label: 'Host rhythm',
          title: '문의 전에 운영 톤 정리',
          description: '응답 방식과 사용 리듬이 한 번에 읽혀 불필요한 왕복을 줄입니다.'
        }
      ]
    : [
        {
          label: 'Conversation cue',
          title: '상황과 시도한 내용부터',
          description: '질문/공유의 배경이 먼저 보여야 다음 답변이 빠르게 붙습니다.'
        },
        {
          label: 'Closing line',
          title: '대답을 부르는 마지막 문장',
          description: '읽는 사람이 바로 반응할 수 있는 한 줄 요청으로 게시판 톤을 바꿉니다.'
        }
      ];
  const heroLedger = isMarket
    ? [
        { label: 'Flow', value: '소개 톤 → 조건 정리 → 문의 준비' },
        { label: 'Audience', value: '공방을 찾는 메이커와 팀' }
      ]
    : [
        { label: 'Flow', value: '주제 선택 → 맥락 정리 → 게시 준비' },
        { label: 'Audience', value: '질문과 공유를 찾는 메이커' }
      ];

  return (
    <main className={`${styles.page} ${isMarket ? styles.marketPage : ''}`}>
      <div className={`${styles.container} ${isMarket ? styles.marketContainer : ''}`}>
        <header className={`${styles.topNav} ${isMarket ? styles.marketTopNav : ''}`}>
          <Link href="/" className={styles.brandBlock}>
            <span className={styles.brandEyebrow}>atelier network</span>
            <span className={`${styles.logo} ${isMarket ? styles.marketLogo : ''}`}>은금슬쩍</span>
          </Link>

          <nav className={`${styles.mainMenu} ${isMarket ? styles.marketMainMenu : ''}`} aria-label="대메뉴">
            {mainMenus.map((menu) => (
              <Link
                key={menu.id}
                href={menu.href}
                className={`${styles.mainMenuLink} ${
                  activeMenu === menu.id ? styles.mainMenuLinkActive : ''
                } ${isMarket ? styles.marketMainMenuLink : ''} ${
                  isMarket && activeMenu === menu.id ? styles.marketMainMenuLinkActive : ''
                }`}
                aria-current={activeMenu === menu.id ? 'page' : undefined}
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          <div className={styles.utilityCluster}>
            <div className={`${styles.headerStatus} ${isMarket ? styles.marketHeaderStatus : ''}`}>
              <span className={styles.headerStatusLabel}>{headerStatus.label}</span>
              <strong>{headerStatus.value}</strong>
            </div>

            {showHeaderAction ? (
              <Link href={ctaHref} className={`${styles.headerAction} ${isMarket ? styles.marketHeaderAction : ''}`}>
                {ctaLabel}
              </Link>
            ) : (
              <div className={`${styles.alertButton} ${isMarket ? styles.marketAlertButton : ''}`}>
                <span className={styles.alertDot} aria-hidden="true" />
                새 흐름
              </div>
            )}
          </div>
        </header>

        {!hideHero ? (
          <section className={`${styles.heroBox} ${isMarket ? styles.marketHeroBox : ''}`}>
            <div className={styles.heroPanel}>
              <div className={styles.heroCopy}>
                {!hideEyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h1 className={`${styles.pageTitle} ${isMarket ? styles.marketPageTitle : ''}`}>{title}</h1>
                {subtitle ? (
                  <p className={`${styles.pageSubtitle} ${isMarket ? styles.marketPageSubtitle : ''}`}>{subtitle}</p>
                ) : null}

                <div className={styles.heroActionRow}>
                  {!hideCta ? (
                    <Link href={ctaHref} className={`${styles.ctaButton} ${isMarket ? styles.marketCtaButton : ''}`}>
                      {ctaLabel}
                    </Link>
                  ) : null}
                  <p className={styles.heroCaption}>{heroStatus.description}</p>
                </div>
              </div>

              <div className={styles.heroLedger}>
                {heroLedger.map((item) => (
                  <div key={item.label} className={styles.heroLedgerItem}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.heroMetaLead}>
                <span className={styles.heroMetaLabel}>{heroStatus.label}</span>
                <strong>{heroStatus.value}</strong>
              </div>

              <div className={styles.heroSignalGrid}>
                {heroHighlights.map((item) => (
                  <div key={item.title} className={styles.heroSignalItem}>
                    <span>{item.label}</span>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div className={`${styles.content} ${isMarket ? styles.marketContent : ''}`}>{children}</div>

        <SiteFooter />
      </div>

      <MobileBottomSheet activeMenu={activeMenu} />
    </main>
  );
}
