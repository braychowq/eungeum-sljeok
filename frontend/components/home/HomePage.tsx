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
    title: '막힌 작업부터 커뮤니티에서 푼다',
    description: '실시간 질문과 인기 공유를 먼저 훑고 필요한 탭으로 바로 진입해 지금의 막힘을 줄입니다.',
    href: '/community',
    ctaLabel: '커뮤니티 보기'
  },
  {
    id: 'studio',
    eyebrow: 'Share',
    title: '작업 공간을 비교하고 연결한다',
    description: '공방 쉐어를 둘러보며 위치, 응답 속도, 문의 가능 여부를 비교해 다음 작업 공간을 고릅니다.',
    href: '/market?tab=studio',
    ctaLabel: '공방 쉐어 보기'
  },
  {
    id: 'market',
    eyebrow: 'Sell',
    title: '판매와 거래로 오늘의 흐름을 닫는다',
    description: '재료와 도구 거래 화면으로 이어지며 탐색에서 판매 행동까지 한 번에 연결합니다.',
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
  const serviceJourney = [
    {
      id: 'community',
      step: 'Step 1',
      title: '지금 막힌 질문부터 확인',
      description: '최근 24시간 안에 올라온 대화와 인기 글에서 바로 출발합니다.',
      stat: `최근 대화 ${freshCommunityCount}개`,
      preview: communityPosts[0]?.title ?? '새 질문이 곧 올라올 예정이에요.',
      sectionHref: '#community',
      sectionLabel: '홈에서 인기글 보기',
      actionHref: '/community?tab=qna',
      actionLabel: 'Q&A로 이동'
    },
    {
      id: 'studio',
      step: 'Step 2',
      title: '작업 공간 후보를 빠르게 비교',
      description: '공방 쉐어 카드와 상세 진입으로 문의 가능한 공간을 이어서 봅니다.',
      stat: `공방 쉐어 ${studioCards.length}곳`,
      preview: studioCards[0]?.title ?? '새 공방이 곧 업데이트될 예정이에요.',
      sectionHref: '#studio',
      sectionLabel: '홈에서 공방 리스트 보기',
      actionHref: '/market?tab=studio',
      actionLabel: '공방 쉐어로 이동'
    },
    {
      id: 'market',
      step: 'Step 3',
      title: '판매와 거래까지 바로 연결',
      description: '마켓 섹션으로 넘어가 오늘 필요한 재료와 도구 흐름을 마무리합니다.',
      stat: `판매 아이템 ${marketCards.length}건`,
      preview: marketCards[0]?.title ?? '새 판매 글이 곧 업데이트될 예정이에요.',
      sectionHref: '#market',
      sectionLabel: '홈에서 판매 아이템 보기',
      actionHref: '/market',
      actionLabel: '마켓으로 이동'
    }
  ] as const;

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
                홈 첫 화면에서 어디서 시작해야 할지 바로 보이도록, 커뮤니티에서 문제를 풀고 공방
                쉐어를 비교한 뒤 마켓으로 닫는 흐름으로 재구성했습니다. 아래 순서대로 따라가거나,
                필요한 단계만 골라 곧바로 들어가면 됩니다.
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

          <div className={styles.serviceJourney} aria-label="추천 시작 흐름">
            <div className={styles.serviceJourneyHeader}>
              <div>
                <span className={styles.serviceJourneyEyebrow}>Start Here</span>
                <strong>오늘의 추천 동선</strong>
              </div>
              <p>질문, 공간, 판매를 한 화면에서 순서대로 이어보세요.</p>
            </div>

            <ol className={styles.serviceJourneyList}>
              {serviceJourney.map((item) => (
                <li key={item.id} className={styles.serviceJourneyItem}>
                  <div className={styles.serviceJourneyStep}>
                    <span>{item.step}</span>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                  <div className={styles.serviceJourneyMeta}>
                    <span className={styles.serviceJourneyStat}>{item.stat}</span>
                    <span className={styles.serviceJourneyPreview}>{item.preview}</span>
                  </div>
                  <div className={styles.serviceJourneyActions}>
                    <Link href={item.sectionHref} className={styles.serviceJourneyAnchor}>
                      {item.sectionLabel}
                    </Link>
                    <Link href={item.actionHref} className={styles.serviceJourneyLink}>
                      {item.actionLabel}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
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
