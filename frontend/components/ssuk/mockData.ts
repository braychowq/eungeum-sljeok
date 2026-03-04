export type CommunityTabId = 'qna' | 'share' | 'free';
export type MarketTabId = 'studio' | 'jewelry';

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

export const marketTabs: Array<{ id: MarketTabId; label: string }> = [
  { id: 'studio', label: '공방 쉐어하기' },
  { id: 'jewelry', label: '쥬얼리 악세사리 마켓' }
];

export const marketCards: Array<{
  id: string;
  tab: MarketTabId;
  title: string;
  href: string;
  imageUrl: string;
}> = [
  {
    id: 'studio-1',
    tab: 'studio',
    title: '휴대 작업실 A',
    href: '/market/studio/studio-1',
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'studio-2',
    tab: 'studio',
    title: '성수 공동공방 B',
    href: '/market/studio/studio-2',
    imageUrl:
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'studio-3',
    tab: 'studio',
    title: '강남 스튜디오 C',
    href: '/market/studio/studio-1',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'studio-4',
    tab: 'studio',
    title: '실버 링 완성품',
    href: '/market/studio/studio-2',
    imageUrl:
      'https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'jewelry-1',
    tab: 'jewelry',
    title: '핸드메이드 팬던트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'jewelry-2',
    tab: 'jewelry',
    title: '원석 비드 세트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'jewelry-3',
    tab: 'jewelry',
    title: '중고 토치 세트',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'jewelry-4',
    tab: 'jewelry',
    title: '소형 은판 스크랩',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1511779031865-5b6f2f4c49ce?auto=format&fit=crop&w=900&q=80'
  }
];
