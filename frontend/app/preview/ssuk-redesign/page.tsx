import Link from 'next/link';
import {
  communityPosts,
  communityTabs,
  marketCards,
  marketTabs,
  type CommunityTabId,
  type MarketTabId
} from '../../../components/ssuk/mockData';
import styles from './page.module.css';

type PreviewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const communityTabIds: CommunityTabId[] = ['qna', 'share', 'free'];
const marketTabIds: MarketTabId[] = ['studio', 'jewelry'];

export default async function SsukRedesignPreviewPage({ searchParams }: PreviewPageProps) {
  const params = searchParams ? await searchParams : {};
  const viewParam = Array.isArray(params.view) ? params.view[0] : params.view;
  const communityTabParam = Array.isArray(params.communityTab)
    ? params.communityTab[0]
    : params.communityTab;
  const marketTabParam = Array.isArray(params.marketTab) ? params.marketTab[0] : params.marketTab;

  const view = viewParam === 'market' ? 'market' : 'community';
  const activeCommunityTab = communityTabIds.includes(communityTabParam as CommunityTabId)
    ? (communityTabParam as CommunityTabId)
    : 'qna';
  const activeMarketTab = marketTabIds.includes(marketTabParam as MarketTabId)
    ? (marketTabParam as MarketTabId)
    : 'studio';

  const communityItems = communityPosts[activeCommunityTab];
  const marketItems = marketCards.filter((item) => item.tab === activeMarketTab && item.imageUrl.trim());

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <header className={styles.topNav}>
          <a href="/" className={styles.logo}>
            silver-ly
          </a>
          <nav className={styles.mainMenu} aria-label="미리보기 메뉴">
            <Link
              href={`/preview/ssuk-redesign?view=community&communityTab=${activeCommunityTab}`}
              className={`${styles.mainMenuLink} ${view === 'community' ? styles.mainMenuLinkActive : ''}`}
            >
              슬쩍 커뮤니티
            </Link>
            <Link
              href={`/preview/ssuk-redesign?view=market&marketTab=${activeMarketTab}`}
              className={`${styles.mainMenuLink} ${view === 'market' ? styles.mainMenuLinkActive : ''}`}
            >
              슬쩍 마켓
            </Link>
          </nav>
        </header>

        {view === 'community' ? (
          <>
            <section className={styles.hero} aria-label="커뮤니티 헤더">
              <p className={styles.eyebrow}>Community Preview</p>
              <h1>슬쩍 커뮤니티</h1>
              <p className={styles.heroDescription}>
                Q&A / 공유 / 아무말 카테고리로 실시간 정보를 나누는 피드형 화면
              </p>
              <Link href="/community/new" className={styles.primaryCta}>
                + 글 등록
              </Link>
            </section>

            <section className={styles.section} aria-label="커뮤니티 카테고리">
              <h2>Categories</h2>
              <div className={styles.chipRow}>
                {communityTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={`/preview/ssuk-redesign?view=community&communityTab=${tab.id}`}
                    className={`${styles.chip} ${
                      activeCommunityTab === tab.id ? styles.chipActive : ''
                    }`}
                    aria-current={activeCommunityTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.section} aria-label="커뮤니티 목록 미리보기">
              <h2>All Posts</h2>
              <p className={styles.sectionMeta}>박스 구획 대신 간격/타이포로 구분한 리스트 스타일</p>
              <ul className={styles.postList}>
                {communityItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.href} className={styles.postCard}>
                      <strong>{item.title}</strong>
                      <span>{item.meta}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            <section className={styles.hero} aria-label="마켓 헤더">
              <p className={styles.eyebrow}>Market Preview</p>
              <h1>슬쩍 마켓</h1>
              <p className={styles.heroDescription}>
                공방 쉐어/악세사리 상품을 카드로 노출하는 모바일 퍼스트 피드형 화면
              </p>
              <Link href="/market/new" className={styles.primaryCta}>
                + 판매 등록
              </Link>
            </section>

            <section className={styles.section} aria-label="마켓 카테고리">
              <h2>Categories</h2>
              <div className={styles.chipRow}>
                {marketTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={`/preview/ssuk-redesign?view=market&marketTab=${tab.id}`}
                    className={`${styles.chip} ${activeMarketTab === tab.id ? styles.chipActive : ''}`}
                    aria-current={activeMarketTab === tab.id ? 'page' : undefined}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.section} aria-label="마켓 목록 미리보기">
              <h2>All Patterns</h2>
              <p className={styles.sectionMeta}>카드 경계를 약화하고 섹션 박스를 제거한 그리드 스타일</p>
              <ul className={styles.marketGrid}>
                {marketItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.href} className={styles.marketCard}>
                      <img src={item.imageUrl} alt={item.title} loading="lazy" />
                      <div className={styles.marketCardBody}>
                        <strong>{item.title}</strong>
                        <span>보기</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
