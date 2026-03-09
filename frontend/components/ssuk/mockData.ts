export type CommunityTabId = 'qna' | 'share' | 'free';
export type MarketTabId = 'studio' | 'jewelry';
export type StudioTrustBadge = 'verified' | 'policy' | 'fast_response';
export type MarketFilterRegion = 'all' | 'seongsu' | 'hongdae' | 'gangnam' | 'euljiro';
export type MarketFilterBudget = 'all' | 'under_6' | 'between_6_10' | 'over_10';
export type MarketFilterDate = 'all' | 'today' | 'tomorrow' | 'within_week';
export type MarketSort = 'recommended' | 'popular' | 'latest' | 'price_low';

export type StudioAvailability = {
  nextAvailableDate: string;
  minUnit: 'hour' | 'day' | 'week';
};

export type StudioListingCard = {
  id: string;
  tab: MarketTabId;
  title: string;
  href: string;
  imageUrl: string;
  locationLabel: string;
  priceLabel: string;
  availabilityLabel: string;
  trustBadges: StudioTrustBadge[];
  isBookable: boolean;
  capacityLabel: string;
  createdAt: string;
  popularityScore: number;
  dayPrice: number;
  region: Exclude<MarketFilterRegion, 'all'>;
  budgetBucket: Exclude<MarketFilterBudget, 'all'>;
  availabilityTag: Exclude<MarketFilterDate, 'all'>;
  availability: StudioAvailability;
};

export type StudioHeroPick = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
  badge: string;
};

export type StudioCurationPick = {
  id: string;
  cardId: string;
  title: string;
  caption: string;
  href: string;
};

export type StudioTrendingItem = {
  id: string;
  rank: number;
  cardId: string;
  title: string;
  meta: string;
  href: string;
};
export type CommunityHighlightKind = 'notice' | 'popular';

export type CommunityHighlightPost = {
  id: string;
  title: string;
  meta: string;
  href: string;
  kind: CommunityHighlightKind;
};

export const communityTabs: Array<{ id: CommunityTabId; label: string }> = [
  { id: 'qna', label: 'Q&A' },
  { id: 'share', label: '공유' },
  { id: 'free', label: '아무말' }
];

export const communityPosts: Record<
  CommunityTabId,
  Array<{ id: string; title: string; meta: string; href: string }>
> = {
  qna: [
    {
      id: 'qna-1',
      title: '[Q&A] 은선 납땜 자국 줄이는 방법?',
      meta: '댓글 12 · 좋아요 32 · 5분 전',
      href: '/community/post/qna-1'
    },
    {
      id: 'qna-2',
      title: '[Q&A] 도금 후 변색 방지 체크리스트',
      meta: '댓글 8 · 저장 21 · 22분 전',
      href: '/community/post/qna-2'
    },
    {
      id: 'qna-3',
      title: '[Q&A] 반지 사이즈 수정 노하우',
      meta: '댓글 5 · 좋아요 17 · 1시간 전',
      href: '/community/post/qna-3'
    },
    {
      id: 'qna-4',
      title: '[Q&A] 실버 액세서리 관리 맞추는 팁',
      meta: '댓글 4 · 저장 9 · 2시간 전',
      href: '/community/post/qna-4'
    },
    {
      id: 'qna-5',
      title: '[Q&A] 작업실 환기 장비 추천',
      meta: '댓글 7 · 좋아요 11 · 3시간 전',
      href: '/community/post/qna-5'
    },
    {
      id: 'qna-6',
      title: '[Q&A] 초보용 툴킷 선택 질문',
      meta: '댓글 10 · 저장 14 · 5시간 전',
      href: '/community/post/qna-6'
    }
  ],
  share: [
    {
      id: 'share-1',
      title: '[공유] 종로 부자재 거래처 정리본',
      meta: '댓글 6 · 저장 28 · 18분 전',
      href: '/community/post/share-1'
    },
    {
      id: 'share-2',
      title: '[공유] 초보용 도금 단가 비교표',
      meta: '댓글 11 · 좋아요 33 · 31분 전',
      href: '/community/post/share-2'
    },
    {
      id: 'share-3',
      title: '[공유] 공방 계약서 샘플 체크포인트',
      meta: '댓글 9 · 저장 22 · 1시간 전',
      href: '/community/post/share-3'
    },
    {
      id: 'share-4',
      title: '[공유] 온라인 판매 사진 조명 세팅',
      meta: '댓글 4 · 좋아요 15 · 2시간 전',
      href: '/community/post/share-4'
    }
  ],
  free: [
    {
      id: 'free-1',
      title: '[아무말] 오늘 폴리싱 6개 끝냈다',
      meta: '댓글 14 · 좋아요 41 · 방금 전',
      href: '/community/post/free-1'
    },
    {
      id: 'free-2',
      title: '[아무말] 주말 플리마켓 다녀온 후기',
      meta: '댓글 5 · 저장 8 · 43분 전',
      href: '/community/post/free-2'
    },
    {
      id: 'free-3',
      title: '[아무말] 작업 집중 잘 되는 음악 추천?',
      meta: '댓글 18 · 좋아요 27 · 1시간 전',
      href: '/community/post/free-3'
    },
    {
      id: 'free-4',
      title: '[아무말] 신상 체인 샘플 받았다',
      meta: '댓글 3 · 저장 6 · 2시간 전',
      href: '/community/post/free-4'
    }
  ]
};

export const communityNotices: CommunityHighlightPost[] = [
  {
    id: 'notice-1',
    title: '[공지] 커뮤니티 이용 가이드 (필독)',
    meta: '운영팀 · 2시간 전',
    href: '/community/post/qna-1',
    kind: 'notice'
  },
  {
    id: 'notice-2',
    title: '[공지] 거래/홍보 관련 게시 원칙 안내',
    meta: '운영팀 · 1일 전',
    href: '/community/post/share-1',
    kind: 'notice'
  }
];

export const communityPopular: CommunityHighlightPost[] = [
  {
    id: 'popular-1',
    title: '[인기] 은선 납땜 자국 줄이는 방법?',
    meta: '댓글 12 · 좋아요 32',
    href: '/community/post/qna-1',
    kind: 'popular'
  },
  {
    id: 'popular-2',
    title: '[인기] 종로 부자재 거래처 정리본',
    meta: '댓글 6 · 저장 28',
    href: '/community/post/share-1',
    kind: 'popular'
  },
  {
    id: 'popular-3',
    title: '[인기] 오늘 폴리싱 6개 끝냈다',
    meta: '댓글 14 · 좋아요 41',
    href: '/community/post/free-1',
    kind: 'popular'
  }
];

export const marketTabs: Array<{ id: MarketTabId; label: string }> = [
  { id: 'studio', label: '공방 쉐어하기' },
  { id: 'jewelry', label: '쥬얼리 악세사리 마켓' }
];

export const marketRegionOptions: Array<{ id: MarketFilterRegion; label: string }> = [
  { id: 'all', label: '전체 지역' },
  { id: 'seongsu', label: '성수' },
  { id: 'hongdae', label: '홍대/연남' },
  { id: 'gangnam', label: '강남' },
  { id: 'euljiro', label: '을지로' }
];

export const marketBudgetOptions: Array<{ id: MarketFilterBudget; label: string }> = [
  { id: 'all', label: '전체 예산' },
  { id: 'under_6', label: '6만 원 이하' },
  { id: 'between_6_10', label: '6~10만 원' },
  { id: 'over_10', label: '10만 원 이상' }
];

export const marketDateOptions: Array<{ id: MarketFilterDate; label: string }> = [
  { id: 'all', label: '전체 일정' },
  { id: 'today', label: '오늘 가능' },
  { id: 'tomorrow', label: '내일 가능' },
  { id: 'within_week', label: '일주일 내' }
];

export const marketSortOptions: Array<{ id: MarketSort; label: string }> = [
  { id: 'recommended', label: '추천순' },
  { id: 'popular', label: '인기순' },
  { id: 'latest', label: '최신순' },
  { id: 'price_low', label: '가격 낮은순' }
];

export const marketCards: StudioListingCard[] = [
  {
    id: 'studio-1',
    tab: 'studio',
    title: '휴대 작업실 A',
    href: '/market/studio/studio-1',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    locationLabel: '성수',
    priceLabel: '₩55,000 / 일',
    availabilityLabel: '오늘 문의 가능',
    trustBadges: ['verified', 'policy', 'fast_response'],
    isBookable: true,
    capacityLabel: '최대 4인',
    createdAt: '2026-03-04',
    popularityScore: 97,
    dayPrice: 55000,
    region: 'seongsu',
    budgetBucket: 'under_6',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'day'
    }
  },
  {
    id: 'studio-2',
    tab: 'studio',
    title: '성수 공동공방 B',
    href: '/market/studio/studio-2',
    imageUrl:
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=900&q=80',
    locationLabel: '성수',
    priceLabel: '₩60,000 / 일',
    availabilityLabel: '내일 가능',
    trustBadges: ['verified', 'policy'],
    isBookable: false,
    capacityLabel: '최대 6인',
    createdAt: '2026-03-02',
    popularityScore: 88,
    dayPrice: 60000,
    region: 'seongsu',
    budgetBucket: 'between_6_10',
    availabilityTag: 'tomorrow',
    availability: {
      nextAvailableDate: '2026-03-10',
      minUnit: 'day'
    }
  },
  {
    id: 'studio-3',
    tab: 'studio',
    title: '강남 스튜디오 C',
    href: '/market/studio/studio-1',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    locationLabel: '강남',
    priceLabel: '₩95,000 / 일',
    availabilityLabel: '일주일 내 가능',
    trustBadges: ['policy', 'fast_response'],
    isBookable: true,
    capacityLabel: '최대 3인',
    createdAt: '2026-03-08',
    popularityScore: 79,
    dayPrice: 95000,
    region: 'gangnam',
    budgetBucket: 'between_6_10',
    availabilityTag: 'within_week',
    availability: {
      nextAvailableDate: '2026-03-14',
      minUnit: 'day'
    }
  },
  {
    id: 'studio-4',
    tab: 'studio',
    title: '을지로 스튜디오 D',
    href: '/market/studio/studio-2',
    imageUrl:
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=900&q=80',
    locationLabel: '을지로',
    priceLabel: '₩120,000 / 일',
    availabilityLabel: '오늘 문의 가능',
    trustBadges: ['verified', 'policy', 'fast_response'],
    isBookable: true,
    capacityLabel: '최대 8인',
    createdAt: '2026-03-06',
    popularityScore: 84,
    dayPrice: 120000,
    region: 'euljiro',
    budgetBucket: 'over_10',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'hour'
    }
  },
  {
    id: 'jewelry-1',
    tab: 'jewelry',
    title: '핸드메이드 팬던트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    locationLabel: '온라인',
    priceLabel: '₩38,000',
    availabilityLabel: '즉시 구매',
    trustBadges: ['policy'],
    isBookable: true,
    capacityLabel: '단일 상품',
    createdAt: '2026-03-05',
    popularityScore: 64,
    dayPrice: 38000,
    region: 'hongdae',
    budgetBucket: 'under_6',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'day'
    }
  },
  {
    id: 'jewelry-2',
    tab: 'jewelry',
    title: '원석 비드 세트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
    locationLabel: '온라인',
    priceLabel: '₩44,000',
    availabilityLabel: '즉시 구매',
    trustBadges: ['policy'],
    isBookable: true,
    capacityLabel: '단일 상품',
    createdAt: '2026-03-06',
    popularityScore: 61,
    dayPrice: 44000,
    region: 'hongdae',
    budgetBucket: 'under_6',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'day'
    }
  },
  {
    id: 'jewelry-3',
    tab: 'jewelry',
    title: '중고 토치 세트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=900&q=80',
    locationLabel: '온라인',
    priceLabel: '₩82,000',
    availabilityLabel: '즉시 구매',
    trustBadges: ['policy', 'fast_response'],
    isBookable: true,
    capacityLabel: '단일 상품',
    createdAt: '2026-03-04',
    popularityScore: 58,
    dayPrice: 82000,
    region: 'gangnam',
    budgetBucket: 'between_6_10',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'day'
    }
  },
  {
    id: 'jewelry-4',
    tab: 'jewelry',
    title: '소형 은판 스크랩',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1511779031865-5b6f2f4c49ce?auto=format&fit=crop&w=900&q=80',
    locationLabel: '온라인',
    priceLabel: '₩110,000',
    availabilityLabel: '즉시 구매',
    trustBadges: ['policy'],
    isBookable: true,
    capacityLabel: '단일 상품',
    createdAt: '2026-03-01',
    popularityScore: 52,
    dayPrice: 110000,
    region: 'euljiro',
    budgetBucket: 'over_10',
    availabilityTag: 'today',
    availability: {
      nextAvailableDate: '2026-03-09',
      minUnit: 'day'
    }
  }
];

export const studioHeroPicks: StudioHeroPick[] = [
  {
    id: 'hero-1',
    title: "3월 첫번째 Editor's PICK",
    subtitle: '성수/을지로 금속 작업 친화 공방 큐레이션',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80',
    href: '/market/studio/studio-1',
    badge: 'Editor Pick'
  },
  {
    id: 'hero-2',
    title: '즉시 문의 가능한 공방 모음',
    subtitle: '오늘 또는 내일 바로 시작 가능한 공간',
    imageUrl:
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1400&q=80',
    href: '/market/studio/studio-1',
    badge: 'Quick Match'
  },
  {
    id: 'hero-3',
    title: '중형 장비 완비 공방',
    subtitle: '집진/세척/도금 장비가 있는 공간',
    imageUrl:
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=1400&q=80',
    href: '/market/studio/studio-2',
    badge: 'Equipment'
  }
];

export const studioRecommendations: StudioCurationPick[] = [
  {
    id: 'recommend-1',
    cardId: 'studio-1',
    title: '초보 제작자 추천',
    caption: '합리적인 일 단가 + 빠른 응답',
    href: '/market/studio/studio-1'
  },
  {
    id: 'recommend-2',
    cardId: 'studio-4',
    title: '팀 작업 추천',
    caption: '최대 8인 수용 + 장비 완비',
    href: '/market/studio/studio-2'
  },
  {
    id: 'recommend-3',
    cardId: 'studio-3',
    title: '집중 작업 추천',
    caption: '소규모 전용 + 주 단위 이용 가능',
    href: '/market/studio/studio-1'
  }
];

export const studioTrending: StudioTrendingItem[] = [
  {
    id: 'trend-1',
    rank: 1,
    cardId: 'studio-1',
    title: '휴대 작업실 A',
    meta: '문의 전환율 1위 · 성수',
    href: '/market/studio/studio-1'
  },
  {
    id: 'trend-2',
    rank: 2,
    cardId: 'studio-2',
    title: '성수 공동공방 B',
    meta: '대기 요청 다수 · 성수',
    href: '/market/studio/studio-2'
  },
  {
    id: 'trend-3',
    rank: 3,
    cardId: 'studio-4',
    title: '을지로 스튜디오 D',
    meta: '장비 만족도 높음 · 을지로',
    href: '/market/studio/studio-2'
  },
  {
    id: 'trend-4',
    rank: 4,
    cardId: 'studio-3',
    title: '강남 스튜디오 C',
    meta: '빠른 응답 · 강남',
    href: '/market/studio/studio-1'
  },
  {
    id: 'trend-5',
    rank: 5,
    cardId: 'studio-1',
    title: '휴대 작업실 A',
    meta: '재문의율 높음 · 성수',
    href: '/market/studio/studio-1'
  }
];
