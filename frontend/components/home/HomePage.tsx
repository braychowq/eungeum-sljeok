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
  const latestCommunityPost = communityPosts
    .filter((post) => !post.isNotice && !post.isPinned)
    .sort((a, b) => a.publishedHoursAgo - b.publishedHoursAgo)[0];
  const featuredStudioCard = studioCards[0];
  const featuredMarketCard = marketCards[0];
  const featuredBanner = bannerItems[0];
  const serviceHubStats = [
    { label: '최근 대화', value: `${freshCommunityCount}개` },
    { label: '공방 쉐어', value: `${studioCards.length}곳` },
    { label: '판매 아이템', value: `${marketCards.length}건` }
  ];
  const journeySteps = [
    {
      id: 'community',
      step: '01',
      eyebrow: 'Start',
      title: '막힌 지점을 먼저 질문으로 푼다',
      description: latestCommunityPost
        ? `지금 가장 가까운 대화는 "${latestCommunityPost.title}" 입니다. 최근 올라온 질문 흐름부터 확인하고 바로 참여할 수 있습니다.`
        : '최근 올라온 질문과 공유 글을 살펴보며 오늘 필요한 대화 흐름부터 정리합니다.',
      href: '#community',
      ctaLabel: '커뮤니티에서 시작',
      meta: `최근 24시간 대화 ${freshCommunityCount}개`
    },
    {
      id: 'studio',
      step: '02',
      eyebrow: 'Space',
      title: '공방 쉐어로 작업 공간을 바로 잇는다',
      description: featuredStudioCard
        ? `"${featuredStudioCard.title}" 같은 공방 쉐어 카드에서 위치와 조건을 보고 다음 작업 공간을 이어서 찾습니다.`
        : '작업 가능한 공간을 빠르게 비교하며 오늘 필요한 작업 환경을 바로 찾습니다.',
      href: '#studio',
      ctaLabel: '공방 쉐어 보기',
      meta: `현재 등록 ${studioCards.length}곳`
    },
    {
      id: 'market',
      step: '03',
      eyebrow: 'Finish',
      title: '마켓에서 판매와 재료 흐름을 닫는다',
      description: featuredMarketCard
        ? `"${featuredMarketCard.title}" 같은 판매 글로 이어지며 재료 수급과 판매 액션을 한 화면 안에서 마무리합니다.`
        : '판매와 재료 탐색을 같은 흐름 안에 묶어 작업 후반 액션까지 자연스럽게 연결합니다.',
      href: '#market',
      ctaLabel: '마켓으로 이동',
      meta: `현재 판매 ${marketCards.length}건`
    }
  ] as const;

  return (
    <main className={styles.page}>
      <div className={styles.pageGlow} aria-hidden="true" />

      <div className={styles.container}>
        <TopNav items={navItems} />

        <BannerCarousel items={bannerItems} />

        <section className={styles.serviceHub} aria-label="슬쩍 서비스 허브">
          <div className={styles.serviceHubIntro}>
            <div className={styles.serviceHubLead}>
              <div className={styles.serviceHubCopy}>
                <span className={styles.serviceHubEyebrow}>Atelier flow</span>
                <h1>배우고, 연결하고, 판매까지 이어지는 오늘의 슬쩍 리듬</h1>
                <p>
                  홈에서 바로 커뮤니티와 공방 쉐어, 마켓을 한 호흡으로 탐색할 수 있도록 시작점을 다시
                  묶었습니다. 박스형 관리자 화면 대신 브랜드형 모바일 서비스처럼, 오늘 필요한 행동부터
                  곧바로 이어가게 만듭니다.
                </p>
              </div>

              <div className={styles.serviceHubIntroAside}>
                <div className={styles.serviceHubMoodCard}>
                  <span>오늘의 큐레이션</span>
                  <strong>
                    {featuredBanner?.subtitle ?? '작업과 거래를 잇는 주얼리 메이커 네트워크'}
                  </strong>
                </div>

                <div className={styles.serviceHubActionRow}>
                  <Link href="#community" className={styles.serviceHubPrimaryLink}>
                    대화부터 시작
                  </Link>
                  <Link href="/market" className={styles.serviceHubGhostLink}>
                    마켓 둘러보기
                  </Link>
                </div>
              </div>
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
            {serviceHubCards.map((card, index) => (
              <article key={card.id} className={styles.serviceHubCard}>
                <div className={styles.serviceHubCardTop}>
                  <span className={styles.serviceHubCardIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.serviceHubCardEyebrow}>{card.eyebrow}</span>
                </div>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
                <Link href={card.href} className={styles.serviceHubCardLink}>
                  {card.ctaLabel}
                </Link>
              </article>
            ))}
          </div>

          <div className={styles.serviceHubJourneyLayout}>
            <section className={styles.serviceHubFeature} aria-label="오늘의 시작 추천">
              <div className={styles.serviceHubFeatureHeader}>
                <span className={styles.serviceHubEyebrow}>Recommended start</span>
                <strong>오늘은 커뮤니티에서 먼저 막힌 지점을 푸는 흐름이 가장 빠릅니다.</strong>
              </div>

              <p className={styles.serviceHubFeatureCopy}>
                최근 대화량이 가장 높고, 공방 쉐어와 마켓 진입 전 필요한 정보가 여기에서 먼저
                풀립니다. 질문을 확인하고 이어서 공간이나 판매 흐름으로 넘어가면 훨씬 자연스럽습니다.
              </p>

              <div className={styles.serviceHubFeaturePanel}>
                <div className={styles.serviceHubFeatureMetric}>
                  <span>가장 먼저 볼 항목</span>
                  <strong>{latestCommunityPost?.title ?? '최근 인기 커뮤니티 글'}</strong>
                </div>
                <div className={styles.serviceHubFeatureMetric}>
                  <span>바로 이어질 다음 단계</span>
                  <strong>공방 쉐어와 마켓 탐색</strong>
                </div>
              </div>

              <div className={styles.serviceHubFeatureActions}>
                <Link href="#community" className={styles.serviceHubPrimaryLink}>
                  인기글부터 보기
                </Link>
                <Link href="/community" className={styles.serviceHubSecondaryLink}>
                  전체 커뮤니티 보기
                </Link>
              </div>
            </section>

            <section className={styles.serviceHubJourney} aria-label="서비스 이동 흐름">
              <div className={styles.serviceHubJourneyHeader}>
                <span className={styles.serviceHubEyebrow}>Today&apos;s path</span>
                <h2>홈에서 바로 이어지는 3단계 작업 여정</h2>
              </div>

              <ol className={styles.serviceHubJourneyList}>
                {journeySteps.map((step) => (
                  <li key={step.id} className={styles.serviceHubJourneyItem}>
                    <div className={styles.serviceHubJourneyStep}>
                      <span>{step.step}</span>
                      <small>{step.eyebrow}</small>
                    </div>
                    <div className={styles.serviceHubJourneyBody}>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                      <div className={styles.serviceHubJourneyFooter}>
                        <span>{step.meta}</span>
                        <Link href={step.href} className={styles.serviceHubTextLink}>
                          {step.ctaLabel}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </section>

        <CommunitySection posts={communityPosts} />

        <HorizontalCardSlider
          id="studio"
          title="슬쩍 공방 쉐어하기"
          eyebrow="Studio share"
          description="오늘 필요한 작업 공간을 한 눈에 둘러보고 바로 연결할 수 있는 셀렉션"
          cardTag="공방 쉐어"
          cards={studioCards}
          headerHref="/market?tab=studio"
        />

        <HorizontalCardSlider
          id="market"
          title="슬쩍 물건 판매하기"
          eyebrow="Maker market"
          description="판매 중인 재료와 도구를 감도 있는 카드 흐름으로 이어보는 셀렉션"
          cardTag="판매 셀렉션"
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
