import Link from 'next/link';
import BannerCarousel from './BannerCarousel';
import CommunitySection from './CommunitySection';
import HorizontalCardSlider from './HorizontalCardSlider';
import MobileBottomSheet from '../common/MobileBottomSheet';
import ProductEditorialCard from '../common/ProductEditorialCard';
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
    step: '01',
    eyebrow: 'Talk',
    title: '질문과 공유에서 오늘의 막힘을 먼저 푼다',
    description: '최근 올라온 질문과 공유 흐름부터 읽고, 가장 가까운 대화에 바로 합류할 수 있습니다.',
    href: '/community',
    ctaLabel: '커뮤니티 보기',
    metric: '대화 흐름',
    readoutLabel: '가장 가까운 글',
    tags: ['Q&A', '공유', '아무말'],
    note: '막힌 지점을 먼저 푸는 시작점'
  },
  {
    id: 'studio',
    step: '02',
    eyebrow: 'Share',
    title: '공방 쉐어로 작업 공간과 조건을 바로 잇는다',
    description: '공방 분위기와 조건을 먼저 읽고, 오늘 필요한 작업 환경을 끊기지 않게 이어갑니다.',
    href: '/market?tab=studio',
    ctaLabel: '공방 쉐어 보기',
    metric: '공간 연결',
    readoutLabel: '바로 이어질 공간',
    tags: ['위치', '장비', '운영 조건'],
    note: '실제 작업 가능한 공간을 비교하는 단계'
  },
  {
    id: 'market',
    step: '03',
    eyebrow: 'Sell',
    title: '마켓에서 재료 수급과 판매 흐름을 마무리한다',
    description: '재료와 도구를 훑고 판매 글까지 바로 이어지도록, 작업 후반 액션을 한 리듬 안에 묶었습니다.',
    href: '/market',
    ctaLabel: '마켓 보기',
    metric: '판매 마감',
    readoutLabel: '오늘의 셀렉션',
    tags: ['재료', '도구', '판매 글'],
    note: '마지막 거래 액션까지 닫는 단계'
  }
] as const;

const routeToneMap = {
  community: 'warm',
  studio: 'forest',
  market: 'neutral'
} as const;

export default function HomePage() {
  const freshCommunityCount = communityPosts.filter((post) => post.publishedHoursAgo <= 24).length;
  const latestCommunityPost = communityPosts
    .filter((post) => !post.isNotice && !post.isPinned)
    .sort((a, b) => a.publishedHoursAgo - b.publishedHoursAgo)[0];
  const featuredStudioCard = studioCards[0];
  const featuredMarketCard = marketCards[0];
  const featuredBanner = bannerItems[0];
  const studioBrowseHref = '/market?tab=studio';
  const serviceHubSignals = [
    {
      label: 'This hour',
      value: featuredBanner?.subtitle ?? '작업과 거래를 잇는 주얼리 메이커 네트워크',
      detail: '배너 큐레이션에서 오늘의 톤과 무드를 먼저 읽습니다.'
    },
    {
      label: 'Talk first',
      value: latestCommunityPost?.title ?? '최근 인기 커뮤니티 글',
      detail: `최근 24시간 새 대화 ${freshCommunityCount}개가 이어지는 중입니다.`
    },
    {
      label: 'Next move',
      value: featuredStudioCard?.title ?? '공방 쉐어 셀렉션',
      detail: `공방 ${studioCards.length}곳과 판매 ${marketCards.length}건을 한 흐름으로 엮었습니다.`
    }
  ] as const;
  const serviceHubSpotlight = [
    {
      label: '오늘의 시작',
      value: latestCommunityPost?.title ?? '최근 인기 커뮤니티 글'
    },
    {
      label: '이어질 공간',
      value: featuredStudioCard?.title ?? '공방 쉐어 셀렉션'
    },
    {
      label: '마감 액션',
      value: featuredMarketCard?.title ?? '판매 셀렉션'
    }
  ] as const;
  const dispatchCards = serviceHubCards.map((card) => {
    if (card.id === 'community') {
      return {
        ...card,
        metric: `24h ${freshCommunityCount}개`,
        readoutValue: latestCommunityPost?.title ?? '최근 커뮤니티 대화'
      };
    }

    if (card.id === 'studio') {
      return {
        ...card,
        metric: `${studioCards.length}곳`,
        readoutValue: featuredStudioCard?.title ?? '새로운 공방 쉐어'
      };
    }

    return {
      ...card,
      metric: `${marketCards.length}건`,
      readoutValue: featuredMarketCard?.title ?? '새로운 판매 셀렉션'
    };
  });
  const editorialSequenceStops = [
    {
      label: 'Talk',
      value: `${freshCommunityCount}개의 새 대화`,
      detail: latestCommunityPost?.title ?? '최근 커뮤니티 대화'
    },
    {
      label: 'Studio',
      value: `${studioCards.length}곳 공간 셀렉션`,
      detail: featuredStudioCard?.title ?? '공방 쉐어 셀렉션'
    },
    {
      label: 'Market',
      value: `${marketCards.length}건 거래 흐름`,
      detail: featuredMarketCard?.title ?? '판매 셀렉션'
    },
    {
      label: 'Archive',
      value: `${libraryEntries.length}개 자료 아카이브`,
      detail: libraryEntries[0]?.title ?? '대표 가이드'
    }
  ] as const;

  return (
    <main className={styles.page}>
      <div className={styles.pageGlow} aria-hidden="true" />

      <div className={styles.container}>
        <TopNav items={navItems} freshCount={freshCommunityCount} />

        <BannerCarousel items={bannerItems} />

        <section className={styles.serviceHub} aria-label="슬쩍 서비스 허브">
          <div className={styles.serviceHubRunway}>
            <section className={styles.serviceHubLead} aria-label="홈 시작 안내">
              <div className={styles.serviceHubCopy}>
                <span className={styles.serviceHubEyebrow}>Atelier dispatch</span>
                <h1>오늘 필요한 흐름을 먼저 고르고, 바로 작업 리듬으로 이어갑니다</h1>
                <p>
                  질문이 먼저인지, 공간 탐색이 급한지, 판매 마감이 필요한지 한 번에 읽고 바로 다음
                  화면으로 이어갈 수 있게 엮었습니다. 가장 가까운 대화와 공간, 거래 액션을 같은 리듬으로
                  고를 수 있습니다.
                </p>
              </div>

              <div className={styles.serviceHubActionRow}>
                <Link href="/community" className={styles.serviceHubPrimaryLink}>
                  커뮤니티에서 시작
                </Link>
                <Link href={studioBrowseHref} className={styles.serviceHubGhostLink}>
                  공방 둘러보기
                </Link>
              </div>

              <div className={styles.serviceHubSignalRail} aria-label="홈 실시간 신호">
                {serviceHubSignals.map((signal) => (
                  <div key={signal.label} className={styles.serviceHubSignalCard}>
                    <span>{signal.label}</span>
                    <strong>{signal.value}</strong>
                    <p>{signal.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <article className={styles.serviceHubSpotlight}>
              {featuredBanner ? (
                <div className={styles.serviceHubSpotlightMedia} aria-hidden="true">
                  <img
                    src={featuredBanner.imageUrl}
                    alt={featuredBanner.imageAlt}
                    className={styles.serviceHubSpotlightImage}
                  />
                  <div className={styles.serviceHubSpotlightOverlay} />
                </div>
              ) : null}

              <div className={styles.serviceHubSpotlightBody}>
                <span className={styles.serviceHubEyebrow}>This hour&apos;s edit</span>
                <strong>{featuredBanner?.subtitle ?? '오늘의 큐레이션'}</strong>
                <p>
                  최근 {freshCommunityCount}개의 새 대화와 함께 공간 탐색, 판매 액션이 같은 흐름으로
                  이어지도록 가장 먼저 열어둘 장면만 추렸습니다.
                </p>

                <div className={styles.serviceHubSpotlightGrid}>
                  {serviceHubSpotlight.map((item) => (
                    <div key={item.label} className={styles.serviceHubSpotlightItem}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className={styles.serviceHubRouteGrid}>
            {dispatchCards.map((card) => (
              <ProductEditorialCard
                key={card.id}
                href={card.href}
                tone={routeToneMap[card.id]}
                layout="text"
                compact
                badge={card.step}
                eyebrow={card.eyebrow}
                heading={card.title}
                description={card.description}
                signals={
                  <div className={styles.serviceHubRouteMetricGrid}>
                    <div className={styles.serviceHubRouteMetricPanel}>
                      <span>Current signal</span>
                      <strong>{card.metric}</strong>
                    </div>
                    <div className={styles.serviceHubRouteMetricPanel}>
                      <span>{card.readoutLabel}</span>
                      <strong>{card.readoutValue}</strong>
                    </div>
                  </div>
                }
                stats={
                  <div className={styles.serviceHubRouteTagRow}>
                    {card.tags.map((tag) => (
                      <span key={tag} className={styles.serviceHubRouteTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                }
                footer={
                  <div className={styles.serviceHubRouteFooter}>
                    <span className={styles.serviceHubRouteNote}>{card.note}</span>
                    <span className={styles.serviceHubRouteAction}>{card.ctaLabel}</span>
                  </div>
                }
                className={styles.serviceHubRouteEditorial}
                bodyClassName={styles.serviceHubRouteBody}
              />
            ))}
          </div>
        </section>

        <section className={styles.editorialSequence} aria-label="홈 큐레이션 시퀀스">
          <div className={styles.editorialSequenceLead}>
            <div className={styles.editorialSequenceHeader}>
              <div className={styles.editorialSequenceEyebrowRow}>
                <span className={styles.editorialSequenceEyebrow}>Home sequence</span>
                <span className={styles.editorialSequenceIssue}>Edition 04</span>
              </div>

              <strong>질문, 공간, 판매, 자료를 하나의 편집 리듬으로 다시 엮었습니다</strong>
              <p>
                홈 하단은 더 이상 기능별 박스를 나열하지 않고, 지금 바로 필요한 액션을 고르는 연속된
                흐름으로 정리했습니다. 먼저 읽을 대화와 공간, 거래, 참고 자료가 같은 속도로 이어집니다.
              </p>
            </div>

            <div className={styles.editorialSequenceStops}>
              {editorialSequenceStops.map((item) => (
                <div key={item.label} className={styles.editorialSequenceStop}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.editorialSequenceStack}>
            <CommunitySection posts={communityPosts} />

            <HorizontalCardSlider
              id="studio"
              sequence="02"
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
              sequence="03"
              title="슬쩍 물건 판매하기"
              eyebrow="Maker market"
              description="판매 중인 재료와 도구를 감도 있는 카드 흐름으로 이어보는 셀렉션"
              cardTag="판매 셀렉션"
              cards={marketCards}
              headerHref="/market"
              tone="market"
            />

            <InfoLibrarySection entries={libraryEntries} sequence="04" />
          </div>
        </section>

        <SiteFooter />
      </div>

      <MobileBottomSheet activeMenu="home" />
    </main>
  );
}
