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
    href: '/community/post/qna-1',
    likeCount: 34,
    commentCount: 14,
    viewCount: 620,
    publishedHoursAgo: 3
  },
  {
    id: 'qna-2',
    category: 'qna',
    title: '[Q&A] 도금 후 변색 방지 체크리스트',
    href: '/community/post/qna-2',
    likeCount: 28,
    commentCount: 16,
    viewCount: 510,
    publishedHoursAgo: 5
  },
  {
    id: 'qna-3',
    category: 'qna',
    title: '[Q&A] 은판 두께별 톱날 선택 기준 정리',
    href: '/community/post/qna-3',
    likeCount: 22,
    commentCount: 19,
    viewCount: 430,
    publishedHoursAgo: 8
  },
  {
    id: 'qna-4',
    category: 'qna',
    title: '[Q&A] 은세척 후 얼룩 남을 때 원인 체크',
    href: '/community/post/qna-4',
    likeCount: 18,
    commentCount: 12,
    viewCount: 390,
    publishedHoursAgo: 11
  },
  {
    id: 'qna-5',
    category: 'qna',
    title: '[Q&A] 유광 마감에서 미세 스크래치 줄이는 법',
    href: '/community/post/qna-5',
    likeCount: 14,
    commentCount: 9,
    viewCount: 300,
    publishedHoursAgo: 17
  },
  {
    id: 'qna-6',
    category: 'qna',
    title: '[Q&A] 왁스 카빙 후 캐스팅 수축률 질문',
    href: '/community/post/qna-6',
    likeCount: 11,
    commentCount: 7,
    viewCount: 250,
    publishedHoursAgo: 23
  },
  {
    id: 'qna-7',
    category: 'qna',
    title: '[Q&A] 실버 체인 연결구 강도 차이 궁금해요',
    href: '/community/post/qna-7',
    likeCount: 9,
    commentCount: 6,
    viewCount: 220,
    publishedHoursAgo: 31
  },
  {
    id: 'qna-notice',
    category: 'qna',
    title: '[공지] 질문 글 작성 전 검색 가이드',
    href: '/community/post/qna-notice',
    likeCount: 999,
    commentCount: 120,
    viewCount: 5400,
    publishedHoursAgo: 1,
    isNotice: true
  },
  {
    id: 'share-1',
    category: 'share',
    title: '[공유] 초보 제작자 체크리스트 템플릿',
    href: '/community/post/share-1',
    likeCount: 41,
    commentCount: 11,
    viewCount: 700,
    publishedHoursAgo: 2
  },
  {
    id: 'share-2',
    category: 'share',
    title: '[공유] 도금소 비교 후기 요약',
    href: '/community/post/share-2',
    likeCount: 29,
    commentCount: 18,
    viewCount: 560,
    publishedHoursAgo: 6
  },
  {
    id: 'share-3',
    category: 'share',
    title: '[공유] 반지 사이즈 측정 템플릿 업데이트',
    href: '/community/post/share-3',
    likeCount: 25,
    commentCount: 14,
    viewCount: 520,
    publishedHoursAgo: 9
  },
  {
    id: 'share-4',
    category: 'share',
    title: '[공유] 소형 토치 세팅값 모음',
    href: '/community/post/share-4',
    likeCount: 20,
    commentCount: 13,
    viewCount: 410,
    publishedHoursAgo: 12
  },
  {
    id: 'share-5',
    category: 'share',
    title: '[공유] 택배 포장 재료 단가표 공유',
    href: '/community/post/share-5',
    likeCount: 16,
    commentCount: 10,
    viewCount: 330,
    publishedHoursAgo: 15
  },
  {
    id: 'share-6',
    category: 'share',
    title: '[공유] 작업 동선 체크리스트 리뉴얼',
    href: '/community/post/share-6',
    likeCount: 13,
    commentCount: 8,
    viewCount: 280,
    publishedHoursAgo: 21
  },
  {
    id: 'share-7',
    category: 'share',
    title: '[공유] 주차권 정산 꿀팁 모음',
    href: '/community/post/share-7',
    likeCount: 10,
    commentCount: 7,
    viewCount: 210,
    publishedHoursAgo: 29
  },
  {
    id: 'share-pinned',
    category: 'share',
    title: '[고정] 자료실 업로드 규칙 안내',
    href: '/community/post/share-pinned',
    likeCount: 880,
    commentCount: 95,
    viewCount: 4900,
    publishedHoursAgo: 4,
    isPinned: true
  },
  {
    id: 'free-1',
    category: 'free',
    title: '[아무말] 오늘 작업하다가 제일 웃겼던 순간',
    href: '/community/post/free-1',
    likeCount: 33,
    commentCount: 20,
    viewCount: 780,
    publishedHoursAgo: 1
  },
  {
    id: 'free-2',
    category: 'free',
    title: '[아무말] 작업실에서 듣는 플레이리스트 추천',
    href: '/community/post/free-2',
    likeCount: 30,
    commentCount: 15,
    viewCount: 640,
    publishedHoursAgo: 4
  },
  {
    id: 'free-3',
    category: 'free',
    title: '[아무말] 오늘 공방 출석 체크합니다',
    href: '/community/post/free-3',
    likeCount: 24,
    commentCount: 17,
    viewCount: 590,
    publishedHoursAgo: 7
  },
  {
    id: 'free-4',
    category: 'free',
    title: '[아무말] 작업 끝나고 손목 스트레칭 루틴 공유',
    href: '/community/post/free-4',
    likeCount: 19,
    commentCount: 13,
    viewCount: 450,
    publishedHoursAgo: 10
  },
  {
    id: 'free-5',
    category: 'free',
    title: '[아무말] 이번 주 목표 같이 적어봐요',
    href: '/community/post/free-5',
    likeCount: 17,
    commentCount: 10,
    viewCount: 360,
    publishedHoursAgo: 16
  },
  {
    id: 'free-6',
    category: 'free',
    title: '[아무말] 공구 정리 습관 다들 어떻게 해요?',
    href: '/community/post/free-6',
    likeCount: 12,
    commentCount: 9,
    viewCount: 290,
    publishedHoursAgo: 22
  },
  {
    id: 'free-7',
    category: 'free',
    title: '[아무말] 실패작 모아보니 패턴이 보이네요',
    href: '/community/post/free-7',
    likeCount: 8,
    commentCount: 5,
    viewCount: 180,
    publishedHoursAgo: 27
  },
  {
    id: 'free-notice',
    category: 'free',
    title: '[공지] 자유게시판 이용 규칙',
    href: '/community/post/free-notice',
    likeCount: 760,
    commentCount: 90,
    viewCount: 4100,
    publishedHoursAgo: 2,
    isNotice: true
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
