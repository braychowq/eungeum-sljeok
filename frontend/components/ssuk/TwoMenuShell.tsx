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
  { id: 'market', label: '슬쩍 마켓', href: '/market' }
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

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topNav}>
          <Link href="/" className={styles.logo}>
            은금슬쩍
          </Link>

          <nav className={styles.mainMenu} aria-label="대메뉴">
            {mainMenus.map((menu) => (
              <Link
                key={menu.id}
                href={menu.href}
                className={`${styles.mainMenuLink} ${
                  activeMenu === menu.id ? styles.mainMenuLinkActive : ''
                }`}
              >
                {menu.label}
              </Link>
            ))}
          </nav>

          <button type="button" className={styles.alertButton}>
            알림
          </button>
        </header>

        {!hideHero ? (
          <section className={styles.heroBox}>
            {!hideEyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <h1 className={styles.pageTitle}>{title}</h1>
            {subtitle ? <p className={styles.pageSubtitle}>{subtitle}</p> : null}
            {!hideCta ? (
              <Link href={ctaHref} className={styles.ctaButton}>
                {ctaLabel}
              </Link>
            ) : null}
          </section>
        ) : null}

        <div className={styles.content}>{children}</div>

        <SiteFooter />
      </div>

      <MobileBottomSheet activeMenu={activeMenu} />
    </main>
  );
}
