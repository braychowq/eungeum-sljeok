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

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <TopNav items={navItems} />

        <BannerCarousel items={bannerItems} />

        <CommunitySection posts={communityPosts} />

        <HorizontalCardSlider
          id="studio"
          title="슬쩍 공방 쉐어하기"
          cards={studioCards}
        />

        <HorizontalCardSlider
          id="market"
          title="슬쩍 물건 판매하기"
          cards={marketCards}
        />

        <InfoLibrarySection entries={libraryEntries} />

        <SiteFooter />
      </div>

      <MobileBottomSheet />
    </main>
  );
}
