import {
  BannerItem,
  CommunityPost,
  LibraryEntry,
  NavItem,
  SliderCard
} from './types';

export const navItems: NavItem[] = [
  { id: 'community', label: '슬쩍 커뮤니티', href: '/community' },
  { id: 'market', label: '슬쩍 마켓', href: '/market' }
];

export const bannerItems: BannerItem[] = [
  {
    id: 'banner-1',
    title: '메인 배너 1',
    subtitle: '핸드메이드 실버 링 큐레이션',
    href: '#community',
    imageUrl:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=85',
    imageAlt: '실버 링과 골드 링이 진열된 주얼리 배너 이미지'
  },
  {
    id: 'banner-2',
    title: '메인 배너 2',
    subtitle: '텍스처 디테일이 살아있는 주얼리 컷',
    href: '#studio',
    imageUrl:
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=1800&q=85',
    imageAlt: '은 반지와 펜던트가 놓인 클로즈업 주얼리 배너 이미지'
  },
  {
    id: 'banner-3',
    title: '메인 배너 3',
    subtitle: '원석 포인트 액세서리 셀렉션',
    href: '#market',
    imageUrl:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1800&q=85',
    imageAlt: '원석 비즈와 메탈 소재가 어우러진 주얼리 배너 이미지'
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'qna-1',
    category: 'qna',
    title: '[Q&A] 은선 납땜 자국 줄이는 방법?',
    href: '/community/post/qna-1'
  },
  {
    id: 'qna-2',
    category: 'qna',
    title: '[Q&A] 도금 후 변색 방지 체크리스트',
    href: '/community/post/qna-2'
  },
  {
    id: 'share-1',
    category: 'share',
    title: '[공유] 초보 제작자 체크리스트 템플릿',
    href: '/community/post/share-1'
  },
  {
    id: 'share-2',
    category: 'share',
    title: '[공유] 도금소 비교 후기 요약',
    href: '/community/post/share-2'
  },
  {
    id: 'free-1',
    category: 'free',
    title: '[아무말] 오늘 작업하다가 제일 웃겼던 순간',
    href: '/community/post/free-1'
  },
  {
    id: 'free-2',
    category: 'free',
    title: '[아무말] 작업실에서 듣는 플레이리스트 추천',
    href: '/community/post/free-2'
  }
];

export const studioCards: SliderCard[] = [
  {
    id: 'studio-1',
    title: '휴대 작업실 A',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-studio-a/600/460',
    imageAlt: '휴대 작업실 A 사진'
  },
  {
    id: 'studio-2',
    title: '성수 공동공방 B',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-studio-b/600/460',
    imageAlt: '성수 공동공방 B 사진'
  },
  {
    id: 'studio-3',
    title: '강남 스튜디오 C',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-studio-c/600/460',
    imageAlt: '강남 스튜디오 C 사진'
  },
  {
    id: 'studio-4',
    title: '한남 공방 D',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-studio-d/600/460',
    imageAlt: '한남 공방 D 사진'
  },
  {
    id: 'studio-5',
    title: '평일 작업실 E',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-studio-e/600/460',
    imageAlt: '평일 작업실 E 사진'
  }
];

export const marketCards: SliderCard[] = [
  {
    id: 'market-1',
    title: '은판 925 자투리',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-market-1/600/460',
    imageAlt: '은판 925 자투리 사진'
  },
  {
    id: 'market-2',
    title: '중고 소형 토치 세트',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-market-2/600/460',
    imageAlt: '중고 소형 토치 세트 사진'
  },
  {
    id: 'market-3',
    title: '원석 비드 믹스팩',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-market-3/600/460',
    imageAlt: '원석 비드 믹스팩 사진'
  },
  {
    id: 'market-4',
    title: '바이스 미니 클램프',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-market-4/600/460',
    imageAlt: '바이스 미니 클램프 사진'
  },
  {
    id: 'market-5',
    title: '줄자/캘리퍼 세트',
    href: '#',
    imageUrl: 'https://picsum.photos/seed/sljeok-market-5/600/460',
    imageAlt: '줄자 캘리퍼 세트 사진'
  }
];

export const libraryEntries: LibraryEntry[] = [
  {
    id: 'library-1',
    title: '[제작자 가이드] 종로 거래처 비교 리포트 (2026.03)',
    meta: '업데이트 2026-03-03 · 출처 확인 완료',
    href: '#'
  },
  {
    id: 'library-2',
    title: '[제작자 가이드] 공방 운영 필수 안전·법규 체크리스트',
    meta: '안전 · 소방 · 화학물질 보관 가이드',
    href: '#'
  }
];
