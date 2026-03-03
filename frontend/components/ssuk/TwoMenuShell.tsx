import Link from 'next/link';
import styles from './TwoMenuShell.module.css';

type TwoMenuShellProps = {
  activeMenu: 'community' | 'market';
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  children: React.ReactNode;
};

const mainMenus = [
  { id: 'community', label: '슬쩍 커뮤니티', href: '/community' },
  { id: 'market', label: '슬쩍 마켓', href: '/market' }
] as const;

const mobileMenus = [
  { id: 'community', label: '커뮤니티', href: '/community' },
  { id: 'market', label: '마켓', href: '/market' }
] as const;

export default function TwoMenuShell({
  activeMenu,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  children
}: TwoMenuShellProps) {
  const eyebrow = activeMenu === 'community' ? 'COMMUNITY VIEW' : 'MARKET VIEW';

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topNav}>
          <Link href="/" className={styles.logo}>
            silver-ly
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

        <section className={styles.heroBox}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.pageTitle}>{title}</h1>
          <p className={styles.pageSubtitle}>{subtitle}</p>
          <Link href={ctaHref} className={styles.ctaButton}>
            {ctaLabel}
          </Link>
        </section>

        <div className={styles.content}>{children}</div>
      </div>

      <nav className={styles.mobileBottomNav} aria-label="하단 메뉴">
        {mobileMenus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            className={`${styles.mobileBottomLink} ${
              activeMenu === menu.id ? styles.mobileBottomLinkActive : ''
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
