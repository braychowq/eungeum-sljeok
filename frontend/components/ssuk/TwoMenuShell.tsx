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
  const headerStatus = isMarket
    ? {
        label: '오늘의 연결',
        value: '공방 탐색과 등록이 같은 흐름으로 이어집니다.'
      }
    : {
        label: '오늘의 흐름',
        value: '질문과 공유가 끊기지 않는 메이커 대화 라인입니다.'
      };
  const heroStatus = isMarket
    ? {
        label: 'Registration Note',
        value: '찾는 사람과 공유하는 사람이 만나는 공간 소개 흐름',
        description: '가격과 조건만 적는 대신, 공간의 감도와 운영 방식이 먼저 느껴지도록 정리했습니다.'
      }
    : {
        label: 'Writing Note',
        value: '지금 필요한 답과 공감이 빠르게 닿는 글 작성 흐름',
        description: '탭 분위기에 맞는 글 구조와 체크리스트를 한 화면에서 다듬을 수 있습니다.'
      };

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

          <div className={`${styles.headerStatus} ${isMarket ? styles.marketHeaderStatus : ''}`}>
            <span className={styles.headerStatusLabel}>{headerStatus.label}</span>
            <strong>{headerStatus.value}</strong>
          </div>

          <div className={`${styles.alertButton} ${isMarket ? styles.marketAlertButton : ''}`}>
            <span className={styles.alertDot} aria-hidden="true" />
            새 소식
          </div>
        </header>

        {!hideHero ? (
          <section className={`${styles.heroBox} ${isMarket ? styles.marketHeroBox : ''}`}>
            <div className={styles.heroCopy}>
              {!hideEyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
              <h1 className={`${styles.pageTitle} ${isMarket ? styles.marketPageTitle : ''}`}>{title}</h1>
              {subtitle ? (
                <p className={`${styles.pageSubtitle} ${isMarket ? styles.marketPageSubtitle : ''}`}>{subtitle}</p>
              ) : null}
              {!hideCta ? (
                <Link href={ctaHref} className={`${styles.ctaButton} ${isMarket ? styles.marketCtaButton : ''}`}>
                  {ctaLabel}
                </Link>
              ) : null}
            </div>

            <div className={styles.heroMeta}>
              <span className={styles.heroMetaLabel}>{heroStatus.label}</span>
              <strong>{heroStatus.value}</strong>
              <p>{heroStatus.description}</p>
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
