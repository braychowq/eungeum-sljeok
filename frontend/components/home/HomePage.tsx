import Link from 'next/link';
import BannerCarousel from './BannerCarousel';
import CommunitySection from './CommunitySection';
import HorizontalCardSlider from './HorizontalCardSlider';
import MobileBottomSheet from '../common/MobileBottomSheet';
import SiteFooter from '../common/SiteFooter';
import {
  bannerItems,
  communityPosts,
  libraryEntries,
  marketCards,
  navItems,
  studioCards
} from './mockData';
import InfoLibrarySection from './InfoLibrarySection';
import TopNav from './TopNav';
import styles from './HomePage.module.css';

const serviceHubCards = [
  {
    id: 'community',
    eyebrow: 'Talk',
    title: '질문과 공유로 막히는 지점을 먼저 푼다',
    description: '최근 인기 글과 카테고리 바로가기로 지금 필요한 대화 흐름에 빠르게 합류합니다.',
    href: '/community',
    ctaLabel: '커뮤니티 보기'
  },
  {
    id: 'studio',
    eyebrow: 'Share',
    title: '작업 공간을 찾거나 내 공방을 연결한다',
    description: '공방 쉐어 섹션에서 바로 둘러보고, 작업 가능한 공간과 운영 흐름을 이어서 확인합니다.',
    href: '/market?tab=studio',
    ctaLabel: '공방 쉐어 보기'
  },
  {
    id: 'market',
    eyebrow: 'Sell',
    title: '재료와 도구를 사고팔며 작업 흐름을 닫는다',
    description: '판매로 이어지는 마켓 진입점을 홈에서 미리 열어 두고, 다음 행동을 끊기지 않게 만듭니다.',
    href: '/market',
    ctaLabel: '마켓 보기'
  }
] as const;

export default function HomePage() {
  const freshCommunityCount = communityPosts.filter((post) => post.publishedHoursAgo <= 24).length;
  const serviceHubStats = [
    { label: '최근 대화', value: `${freshCommunityCount}개` },
    { label: '공방 쉐어', value: `${studioCards.length}곳` },
    { label: '판매 아이템', value: `${marketCards.length}건` }
  ];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <TopNav items={navItems} />

        <BannerCarousel items={bannerItems} />

        <section className={styles.serviceHub} aria-label="슬쩍 서비스 허브">
          <div className={styles.serviceHubIntro}>
            <div className={styles.serviceHubCopy}>
              <span className={styles.serviceHubEyebrow}>Service Hub</span>
              <h1>배우고, 공간을 찾고, 판매까지 이어지는 오늘의 슬쩍 흐름</h1>
              <p>
                홈에서 바로 커뮤니티와 공방 쉐어, 마켓을 한 호흡으로 탐색할 수 있도록 시작점을 다시
                묶었습니다. 지금 필요한 행동부터 고르고 아래 섹션으로 곧바로 이어가면 됩니다.
              </p>
            </div>

            <div className={styles.serviceHubStats} aria-label="서비스 현황 요약">
              {serviceHubStats.map((item) => (
                <div key={item.label} className={styles.serviceHubStatCard}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.serviceHubGrid}>
            {serviceHubCards.map((card) => (
              <article key={card.id} className={styles.serviceHubCard}>
                <span className={styles.serviceHubCardEyebrow}>{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
                <Link href={card.href} className={styles.serviceHubCardLink}>
                  {card.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <CommunitySection posts={communityPosts} />

        <HorizontalCardSlider
          id="studio"
          title="슬쩍 공방 쉐어하기"
          cards={studioCards}
          headerHref="/market?tab=studio"
        />

        <HorizontalCardSlider
          id="market"
          title="슬쩍 물건 판매하기"
          cards={marketCards}
          headerHref="/market"
        />

        <InfoLibrarySection entries={libraryEntries} />

        <SiteFooter />
      </div>

      <MobileBottomSheet />
    </main>
  );
}
