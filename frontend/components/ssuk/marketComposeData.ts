export type MarketComposeTemplate = {
  id: string;
  label: string;
  description: string;
  titleSuggestion: string;
  regionSeed: string;
  availabilitySeed: string;
  priceSeed: string;
  summarySeed: string;
  highlightsSeed: string;
  hostNoteSeed: string;
  tagSeed: string[];
};

export type MarketComposeChecklistItem = {
  id: string;
  label: string;
  description: string;
};

export type MarketComposeGuide = {
  eyebrow: string;
  intro: string;
  valuePitch: string;
  boardPulse: string;
  moderationNote: string;
  titlePlaceholder: string;
  templates: MarketComposeTemplate[];
  checklist: MarketComposeChecklistItem[];
  supportNotes: string[];
};

export type MarketComposeDraft = {
  selectedTemplateId: string;
  title: string;
  region: string;
  availability: string;
  priceLabel: string;
  summary: string;
  highlights: string;
  hostNote: string;
  tags: string;
  completedChecklistIds: string[];
};

export const marketComposePublishingSteps = [
  '등록 포맷을 고른다',
  '운영 조건과 공간 매력을 정리한다',
  '문의 전에 필요한 신뢰 정보를 확인한다',
  '미리보기를 보고 등록 흐름을 마무리한다'
] as const;

export const marketComposeGuide: MarketComposeGuide = {
  eyebrow: 'Studio Listing',
  intro: '공간 운영 방식에 맞는 소개 템플릿을 먼저 고르고, 조건과 분위기를 한 화면에서 정리하는 등록 흐름입니다.',
  valuePitch: '가격과 위치만 적는 대신, 어떤 작업자가 어떤 순간에 이 공간을 쓰기 좋은지가 먼저 보이도록 구성했습니다.',
  boardPulse: '성수/을지로 소형 공방, 클래스 겸용 공간, 하루 대관 문의가 가장 많이 열리고 있어요.',
  moderationNote: '연락 전 확인해야 할 운영 조건과 안전 안내가 분명해야 문의 전환이 좋아집니다.',
  titlePlaceholder: '공방 이름과 한 줄 분위기를 적어보세요.',
  templates: [
    {
      id: 'day-share',
      label: '하루 쉐어',
      description: '짧은 대관 문의가 들어오기 좋은 빠른 소개 템플릿',
      titleSuggestion: '성수 채광 좋은 주얼리 공방, 하루 단위로 바로 쉐어 가능',
      regionSeed: '성수 · 서울숲 도보 8분',
      availabilitySeed: '평일 11:00-19:00 · 주말 협의 가능',
      priceSeed: '1일 85,000원',
      summarySeed:
        '작은 촬영과 제작을 함께 할 수 있는 밝은 작업실입니다. 창가 테이블과 기본 공구 정리가 잘 되어 있어 하루 단위 작업에 적합합니다.',
      highlightsSeed: '채광 좋은 메인 테이블, 기본 공구 정리, 피클링/폴리싱 동선 분리',
      hostNoteSeed:
        '초보 작업자도 동선을 바로 이해할 수 있게 도구 위치와 사용 주의점을 현장에서 설명드리고 있습니다.',
      tagSeed: ['성수', '하루대관', '주얼리공방']
    },
    {
      id: 'fixed-share',
      label: '고정 쉐어',
      description: '반복 입주자나 정기 사용자를 받기 좋은 소개 템플릿',
      titleSuggestion: '을지로 공동 작업대 고정 쉐어, 주 3일 입주 가능',
      regionSeed: '을지로 3가 · 지하철 도보 5분',
      availabilitySeed: '월/수/금 10:00-20:00',
      priceSeed: '월 420,000원',
      summarySeed:
        '반복 생산이나 주문 제작이 많은 메이커에게 맞춘 고정 좌석형 공방입니다. 보관함, 공동 촬영 존, 포장 테이블을 함께 사용할 수 있습니다.',
      highlightsSeed: '개인 보관함 제공, 공동 촬영 존, 포장 테이블, 장기 사용 우대',
      hostNoteSeed:
        '고정 입주자는 작업 루틴이 중요해서 소음 시간대와 택배 수령 규칙을 명확히 안내하고 있습니다.',
      tagSeed: ['을지로', '고정입주', '공동작업실']
    },
    {
      id: 'class-space',
      label: '클래스 겸용',
      description: '수업과 제작을 함께 운영하는 공간을 소개하는 템플릿',
      titleSuggestion: '소규모 원데이 클래스 가능한 마포 작업실, 촬영까지 한 번에',
      regionSeed: '연남 · 홍대입구 도보 10분',
      availabilitySeed: '화-토 12:00-21:00',
      priceSeed: '시간당 25,000원 / 클래스 패키지 협의',
      summarySeed:
        '6인 이하 클래스와 소규모 제작을 함께 운영하기 좋은 공간입니다. 세척 존과 촬영 배경지, 안내용 모니터를 함께 사용할 수 있습니다.',
      highlightsSeed: '6인 클래스 좌석, 촬영 배경지, 안내 모니터, 세척 존 분리',
      hostNoteSeed:
        '클래스 운영이 있는 날은 사용 목적과 세팅 시간을 미리 공유해주시면 동선과 장비를 맞춰 준비합니다.',
      tagSeed: ['마포', '원데이클래스', '촬영가능']
    }
  ],
  checklist: [
    {
      id: 'policy',
      label: '가격과 최소 이용 단위를 분명히 적었나요?',
      description: '문의 전에 예산을 판단할 수 있어야 불필요한 왕복을 줄일 수 있습니다.'
    },
    {
      id: 'safety',
      label: '사용 가능한 도구와 안전 규칙을 적었나요?',
      description: '화기, 약품, 소음 제한이 있으면 미리 보여주는 편이 신뢰를 줍니다.'
    },
    {
      id: 'response',
      label: '응답 가능 시간과 예약 방식을 적었나요?',
      description: '어디로 어떻게 문의하면 되는지가 선명해야 전환이 끊기지 않습니다.'
    }
  ],
  supportNotes: [
    '공간 사진이 아직 없더라도 채광, 좌석 수, 장비 상태 같은 핵심 감각은 먼저 적어두세요.',
    '운영 규칙은 딱딱한 문장보다 사용자가 들어오자마자 이해할 수 있는 표현으로 정리하는 편이 좋습니다.'
  ]
};

export function buildMarketComposeDraft(templateId?: string): MarketComposeDraft {
  const template =
    marketComposeGuide.templates.find((item) => item.id === templateId) ??
    marketComposeGuide.templates[0];

  return {
    selectedTemplateId: template.id,
    title: template.titleSuggestion,
    region: template.regionSeed,
    availability: template.availabilitySeed,
    priceLabel: template.priceSeed,
    summary: template.summarySeed,
    highlights: template.highlightsSeed,
    hostNote: template.hostNoteSeed,
    tags: template.tagSeed.join(', '),
    completedChecklistIds: []
  };
}
