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
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          <button type="button" className={`${styles.alertButton} ${isMarket ? styles.marketAlertButton : ''}`}>
            <span className={styles.alertDot} aria-hidden="true" />
            새 소식
          </button>
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
              <span className={styles.heroMetaLabel}>{isMarket ? '오늘의 셀렉션' : '오늘의 흐름'}</span>
              <strong>
                {isMarket
                  ? '공방 쉐어와 판매 흐름을 감도 있게 탐색'
                  : '질문과 공유가 빠르게 섞이는 대화 라인'}
              </strong>
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
