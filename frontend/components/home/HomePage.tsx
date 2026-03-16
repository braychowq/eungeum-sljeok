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
  const studioBrowseHref = '/market?tab=studio';
  const atelierSignals = [
    {
      label: '오늘의 큐레이션',
      value: featuredBanner?.subtitle ?? '작업과 거래를 잇는 주얼리 메이커 네트워크'
    },
    {
      label: '가장 가까운 질문',
      value: latestCommunityPost?.title ?? '최근 인기 커뮤니티 글'
    },
    {
      label: '바로 이어질 공간',
      value: featuredStudioCard?.title ?? '공방 쉐어 셀렉션'
    }
  ] as const;
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
        <TopNav items={navItems} freshCount={freshCommunityCount} />

        <BannerCarousel items={bannerItems} />

        <section className={styles.serviceHub} aria-label="슬쩍 서비스 허브">
          <div className={styles.serviceHubCanvas}>
            <section className={styles.serviceHubLead} aria-label="홈 시작 안내">
              <div className={styles.serviceHubCopy}>
                <span className={styles.serviceHubEyebrow}>Atelier dispatch</span>
                <h1>오늘 필요한 연결을 먼저 고르고, 바로 다음 액션으로 이어갑니다</h1>
                <p>
                  홈 상단을 요약 패널 묶음이 아니라 메이커용 랜딩 경험으로 다시 엮었습니다. 지금 가장
                  반응이 빠른 대화, 바로 이어질 공방, 판매 흐름을 한 리듬 안에서 고를 수 있게 정리했습니다.
                </p>
              </div>

              <div className={styles.serviceHubActionRow}>
                <Link href="#community" className={styles.serviceHubPrimaryLink}>
                  인기 대화부터 보기
                </Link>
                <Link href={studioBrowseHref} className={styles.serviceHubGhostLink}>
                  공방 둘러보기
                </Link>
              </div>

              <div className={styles.serviceHubStats} aria-label="서비스 현황 요약">
                {serviceHubStats.map((item) => (
                  <div key={item.label} className={styles.serviceHubStatCard}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <aside className={styles.serviceHubAside}>
              <article className={styles.serviceHubMoodCard}>
                <div className={styles.serviceHubMoodHeader}>
                  <span>this hour&apos;s edit</span>
                  <strong>{featuredBanner?.subtitle ?? '오늘의 큐레이션'}</strong>
                </div>

                <p>
                  최근 {freshCommunityCount}개의 새 대화와 함께 공간 탐색, 판매 액션이 한 흐름으로
                  이어지도록 지금 볼 만한 신호만 추렸습니다.
                </p>

                <ul className={styles.serviceHubSignalList}>
                  {atelierSignals.map((signal) => (
                    <li key={signal.label} className={styles.serviceHubSignalItem}>
                      <span>{signal.label}</span>
                      <strong>{signal.value}</strong>
                    </li>
                  ))}
                </ul>
              </article>

              <section className={styles.serviceHubJourney} aria-label="서비스 이동 흐름">
                <div className={styles.serviceHubJourneyHeader}>
                  <span className={styles.serviceHubEyebrow}>Today&apos;s path</span>
                  <h2>홈에서 바로 이어지는 3단계 작업 여정</h2>
                </div>

                <ol className={styles.serviceHubJourneyList}>
                  {journeySteps.map((step) => (
                    <li key={step.id} className={styles.serviceHubJourneyItem}>
                      <Link href={step.href} className={styles.serviceHubJourneyLink}>
                        <div className={styles.serviceHubJourneyStep}>
                          <span>{step.step}</span>
                          <small>{step.eyebrow}</small>
                        </div>
                        <div className={styles.serviceHubJourneyBody}>
                          <strong>{step.title}</strong>
                          <p>{step.meta}</p>
                          <span className={styles.serviceHubTextLink}>{step.ctaLabel}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>

          <div className={styles.serviceHubGrid}>
            {serviceHubCards.map((card, index) => (
              <Link key={card.id} href={card.href} className={styles.serviceHubCard}>
                <div className={styles.serviceHubCardTop}>
                  <span className={styles.serviceHubCardIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.serviceHubCardEyebrow}>{card.eyebrow}</span>
                </div>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
                <span className={styles.serviceHubCardLink}>{card.ctaLabel}</span>
              </Link>
            ))}
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
          tone="studio"
        />

        <HorizontalCardSlider
          id="market"
          title="슬쩍 물건 판매하기"
          eyebrow="Maker market"
          description="판매 중인 재료와 도구를 감도 있는 카드 흐름으로 이어보는 셀렉션"
          cardTag="판매 셀렉션"
          cards={marketCards}
          headerHref="/market"
          tone="market"
        />

        <InfoLibrarySection entries={libraryEntries} />

        <SiteFooter />
      </div>

      <MobileBottomSheet />
    </main>
  );
}
