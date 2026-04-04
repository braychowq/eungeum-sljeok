export type CommunityCategory = 'free' | 'qa' | 'market';

export type CommunityComment = {
  author: string;
  date: string;
  body: string;
};

export type CommunityPost = {
  id: string;
  category: CommunityCategory;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  content: string[];
  commentList: CommunityComment[];
};

export type CreateCommunityPostInput = {
  author: string;
  body: string;
  category: CommunityCategory;
  title: string;
  imageNames?: string[];
};

export const communityPosts: CommunityPost[] = [
  {
    id: 'sunny-seongsu-workspace',
    category: 'free',
    title: '오늘 성수 쪽 작업실 날씨 너무 좋네요',
    excerpt:
      '오후 자연광이 좋아서 사진 찍기 딱 좋았어요. 비슷한 분위기 공방 아시는 분 있으면 추천 부탁드려요.',
    author: '구름실버',
    date: '04.02',
    views: 128,
    comments: 14,
    content: [
      '오늘 오후에 성수 쪽 작업실에 있었는데, 창으로 들어오는 빛이 정말 좋더라고요. 작업 테이블 위 은판이 반사되는 톤도 너무 예쁘고, 사진 찍으니 결과물이 훨씬 정갈하게 나왔어요.',
      '요즘은 제품 컷도 중요하지만 작업하는 분위기가 담긴 사진을 같이 올리는 편이라, 빛이 좋은 공방을 더 자주 찾게 됩니다. 혹시 성수나 서울숲 근처에서 자연광 괜찮은 공간 아시는 분 있으면 공유 부탁드려요.',
      '창가 쪽 자리나 오후 2시~4시 사이 빛 방향까지 같이 알려주시면 더 큰 도움이 될 것 같아요. 작은 팁이라도 환영입니다.'
    ],
    commentList: [
      {
        author: 'atelier noon',
        date: '04.02',
        body: '서울숲 쪽은 오후 3시 이후가 특히 좋아요. 큰 창 있는 곳 몇 군데 있는데 원하시면 DM 드릴게요.'
      },
      {
        author: '온화주얼리',
        date: '04.02',
        body: '저는 한남 쪽 공유 공방도 추천해요. 직접광은 강하지 않지만 부드럽게 퍼져서 실버 제품 찍기 좋았습니다.'
      }
    ]
  },
  {
    id: 'silver-cleaning-tip',
    category: 'qa',
    title: '은세척기 없이 산화 자국 정리하는 팁 있을까요?',
    excerpt:
      '초음파 세척기 없이도 집에서 정리 가능한 방법이 있으면 알려주세요. 베이킹소다 방법은 어느 정도까지 효과가 있는지 궁금합니다.',
    author: '민트링',
    date: '04.01',
    views: 203,
    comments: 22,
    content: [
      '작업실 장비 없이 집에서 간단히 관리할 수 있는 방법을 찾고 있어요. 테스트 샘플 정도는 괜찮은데 실제 판매 전 제품까지도 적용 가능한지 궁금합니다.',
      '검색해보니 베이킹소다+호일 조합 이야기가 많던데, 표면 무광 처리된 제품이나 얇은 체인 제품에도 괜찮은지 감이 잘 안 오네요.',
      '혹시 장비 없이도 산화 자국 정리해보신 분 계시면 사용한 방법과 주의할 점 알려주시면 감사하겠습니다.'
    ],
    commentList: [
      {
        author: 'silver monday',
        date: '04.01',
        body: '무광 제품은 베이킹소다보다 부드러운 폴리싱 천이 안전했어요. 표면 질감이 바뀌지 않더라고요.'
      },
      {
        author: '구름실버',
        date: '04.01',
        body: '체인은 오래 담그지 말고 짧게 여러 번 확인하는 편이 좋아요. 끝나고 바로 물기 제거도 중요해요.'
      }
    ]
  },
  {
    id: 'used-dust-collector',
    category: 'market',
    title: '소형 집진기 중고로 내놓습니다',
    excerpt:
      '한남 작업실 정리 중입니다. 1년 정도 사용했고 작동 상태 좋아요. 성수/한남 직거래 우선, 관심 있으면 댓글 남겨주세요.',
    author: 'atelier noon',
    date: '04.01',
    views: 89,
    comments: 6,
    content: [
      '작업실 장비 일부를 정리하고 있어서 소형 집진기 하나 양도하려고 합니다. 왁스 카빙 후 정리할 때 주로 사용했고, 사용 기간은 1년 정도예요.',
      '필터는 최근에 교체했고 본체 외관도 큰 흠집 없이 깨끗한 편입니다. 성수나 한남 쪽에서 직거래 가능하신 분을 우선으로 생각하고 있어요.',
      '가격은 댓글이나 메시지로 문의 주시면 상태 사진과 함께 전달드릴게요. 필요하시면 작동 영상도 찍어드릴 수 있습니다.'
    ],
    commentList: [
      {
        author: 'mora studio',
        date: '04.01',
        body: '혹시 모델명 알 수 있을까요? 소음 정도도 궁금합니다.'
      },
      {
        author: 'atelier noon',
        date: '04.01',
        body: '모델명은 DM으로 보내드릴게요. 소음은 일반 데스크 환풍기보다 조금 큰 정도였어요.'
      }
    ]
  },
  {
    id: 'weekend-flea-market',
    category: 'free',
    title: '이번 주말 플리마켓 준비하시는 분 계신가요?',
    excerpt:
      '패키징 마감 아이디어 공유해요. 작은 카드나 스티커 어디서 제작하는지 궁금합니다.',
    author: '온화주얼리',
    date: '03.31',
    views: 154,
    comments: 11,
    content: [
      '주말 플리마켓 준비하면서 마지막으로 늘 고민되는 게 포장 마감이네요. 작은 감사 카드나 스티커를 추가하고 싶은데, 너무 과하지 않으면서도 브랜드 톤이 느껴졌으면 좋겠어요.',
      '소량 제작이 가능한 곳을 찾고 있는데, 인쇄 품질이나 종이 질감이 괜찮았던 업체가 있으면 추천받고 싶습니다.',
      '직접 만들어 쓰시는 분들은 어떤 형식으로 작업하는지도 궁금해요. 패키지 예시 사진이 있다면 더 좋고요.'
    ],
    commentList: [
      {
        author: '구름실버',
        date: '03.31',
        body: '저는 종이 질감 때문에 소량 인쇄소보다 리소 느낌 나는 곳을 선호해요. 정보 원하시면 공유드릴게요.'
      },
      {
        author: '민트링',
        date: '03.31',
        body: '스티커는 무광 투명지로 뽑으면 과하지 않고 좋았어요. 봉투 씰 느낌으로 마감해도 예쁩니다.'
      }
    ]
  },
  {
    id: 'laser-welding-recommendation',
    category: 'qa',
    title: '레이저 용접 맡길 수 있는 공방 추천 부탁드려요',
    excerpt:
      '소량 수리 맡길 곳을 찾고 있어요. 신뢰할 만한 곳 있으면 비용대와 함께 알려주시면 큰 도움이 됩니다.',
    author: 'silver monday',
    date: '03.30',
    views: 97,
    comments: 8,
    content: [
      '얇은 체인 연결부 수리 때문에 레이저 용접 가능한 공방을 찾고 있습니다. 대량 제작이 아니라 소량 의뢰라서 부담 없이 맡길 수 있는 곳이면 좋겠어요.',
      '검색은 해봤지만 실제 응대나 마감 품질이 어떤지 알기 어려워서, 직접 맡겨보신 분들의 후기가 더 도움이 될 것 같습니다.',
      '지역은 서울이면 어디든 괜찮고, 대략적인 비용대나 소요 시간까지 같이 알려주시면 정말 감사하겠습니다.'
    ],
    commentList: [
      {
        author: 'atelier noon',
        date: '03.30',
        body: '성수 쪽 두 곳 맡겨봤는데 마감 괜찮았어요. 비용은 작업 난이도 따라 달랐지만 소량도 받아줬습니다.'
      },
      {
        author: '온화주얼리',
        date: '03.30',
        body: '한남 쪽은 예약이 빨리 차서 일정 먼저 문의해보시는 걸 추천드려요.'
      }
    ]
  },
  {
    id: 'wax-carving-tool-set',
    category: 'market',
    title: '왁스 카빙 툴 세트 양도합니다',
    excerpt:
      '입문용으로 괜찮은 구성이고 사용감 적습니다. 사진 필요하시면 글 남겨주세요. 택배도 가능합니다.',
    author: 'mora studio',
    date: '03.29',
    views: 76,
    comments: 3,
    content: [
      '왁스 카빙 툴 세트를 정리하려고 합니다. 입문하시는 분들이 바로 써보기 좋은 구성으로 묶여 있고, 사용감은 있지만 관리 상태는 좋은 편입니다.',
      '기본 조각도구, 줄 세트, 왁스 블록 일부까지 함께 드릴 수 있어요. 택배 거래도 가능하지만 가능하면 직거래를 선호합니다.',
      '구성 사진이나 세부 품목은 요청 주시면 댓글이나 메시지로 보내드릴게요. 관심 있으신 분 편하게 남겨주세요.'
    ],
    commentList: [
      {
        author: '민트링',
        date: '03.29',
        body: '혹시 구성 사진 받아볼 수 있을까요? 입문용 찾고 있었어요.'
      },
      {
        author: 'mora studio',
        date: '03.29',
        body: '네, 오늘 저녁에 촬영해서 올리거나 메시지로 전달드릴게요.'
      }
    ]
  }
];

export function getCommunityPost(postId: string) {
  return communityPosts.find((post) => post.id === postId);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatCommunityDate() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  return `${month}.${day}`;
}

function toParagraphs(body: string) {
  return body
    .split(/\n{2,}|\r\n\r\n|\r\n|\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function createExcerpt(body: string) {
  const normalized = body.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 72) {
    return normalized;
  }

  return `${normalized.slice(0, 72).trim()}…`;
}

export function createCommunityPost(input: CreateCommunityPostInput) {
  const cleanTitle = input.title.trim();
  const cleanAuthor = input.author.trim() || '익명 메이커';
  const cleanBody = input.body.trim();
  const paragraphs = toParagraphs(cleanBody);
  const post: CommunityPost = {
    id: `${slugify(cleanTitle) || 'community-post'}-${Date.now()}`,
    category: input.category,
    title: cleanTitle,
    excerpt: createExcerpt(cleanBody),
    author: cleanAuthor,
    date: formatCommunityDate(),
    views: 0,
    comments: 0,
    content: paragraphs.length ? paragraphs : [cleanBody],
    commentList: []
  };

  communityPosts.unshift(post);
  return post;
}
