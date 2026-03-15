import { type CommunityTabId } from './mockData';

export type CommunityComposeTemplate = {
  id: string;
  label: string;
  description: string;
  titleSuggestion: string;
  contextSeed: string;
  detailsSeed: string;
  requestSeed: string;
  tagSeed: string[];
};

export type CommunityComposeChecklistItem = {
  id: string;
  label: string;
  description: string;
};

export type CommunityComposeTabGuide = {
  label: string;
  eyebrow: string;
  intro: string;
  valuePitch: string;
  boardPulse: string;
  moderationNote: string;
  titlePlaceholder: string;
  templates: CommunityComposeTemplate[];
  checklist: CommunityComposeChecklistItem[];
  supportNotes: string[];
};

export type CommunityComposeDraft = {
  activeTab: CommunityTabId;
  selectedTemplateId: string;
  title: string;
  context: string;
  details: string;
  request: string;
  tags: string;
  completedChecklistIds: string[];
};

export const communityComposePublishingSteps = [
  '주제와 포맷을 고른다',
  '핵심 맥락과 시도한 내용을 정리한다',
  '신뢰 체크리스트를 확인한다',
  '미리보기를 보고 게시 준비를 마친다'
] as const;

export const communityComposeData: Record<CommunityTabId, CommunityComposeTabGuide> = {
  qna: {
    label: 'Q&A',
    eyebrow: 'Problem Solving',
    intro: '막히는 공정이나 재료 문제를 짧고 정확하게 정리해 빠르게 답을 받는 글 흐름입니다.',
    valuePitch: '재료, 공정 단계, 이미 해본 해결책만 분명해도 답변 속도가 크게 올라갑니다.',
    boardPulse: '지금 많이 올라오는 질문은 납땜, 도금, 작업실 안전입니다.',
    moderationNote: '구매/홍보보다 문제 상황과 조건값이 먼저 보이도록 운영됩니다.',
    titlePlaceholder: '[Q&A] 어떤 문제를 겪고 있나요?',
    templates: [
      {
        id: 'process-help',
        label: '공정 질문',
        description: '실패한 단계와 조건값을 빠르게 공유하는 포맷',
        titleSuggestion: '[Q&A] 은선 납땜 자국이 크게 남는 이유가 뭘까요?',
        contextSeed:
          '0.7mm 은선을 감아 반지 링을 만들고 있고, 하드 솔더로 한 번에 붙이는 작업입니다.',
        detailsSeed:
          '플럭스 양과 버너 거리를 조절했고 400-800-1200 사포까지 해봤지만 자국이 일정하게 사라지지 않았습니다.',
        requestSeed: '비슷한 두께 기준으로 온도나 사포 단계에서 놓치기 쉬운 포인트가 있다면 알려주세요.',
        tagSeed: ['납땜', '실버', '반지']
      },
      {
        id: 'tool-choice',
        label: '도구 추천',
        description: '장비 선택이나 셋업 비교가 필요한 포맷',
        titleSuggestion: '[Q&A] 초보 작업실 환기 장비는 어디까지 갖춰야 할까요?',
        contextSeed:
          '집과 분리된 작은 작업실을 막 세팅하는 단계라 예산이 많지 않고, 납땜과 피클링 작업 위주입니다.',
        detailsSeed:
          '창문 환기와 소형 팬은 준비했는데 후드나 공기청정 장비를 어느 수준까지 추가해야 할지 판단이 어렵습니다.',
        requestSeed: '실제 사용하는 장비 조합이나 꼭 먼저 사야 하는 순서가 있으면 공유 부탁드립니다.',
        tagSeed: ['환기', '장비', '안전']
      }
    ],
    checklist: [
      {
        id: 'qna-material',
        label: '재료와 규격을 적었나요?',
        description: '재료명, 두께, 공정 단계가 있어야 답변이 구체적입니다.'
      },
      {
        id: 'qna-tried',
        label: '이미 시도한 방법을 적었나요?',
        description: '중복 답변을 줄이고 다음 해결책으로 바로 넘어갈 수 있습니다.'
      },
      {
        id: 'qna-safe',
        label: '안전 조건을 함께 적었나요?',
        description: '화기, 약품, 환기 관련 맥락이 있으면 더 안전한 답변을 받습니다.'
      }
    ],
    supportNotes: ['사진 1장만 있어도 맥락 파악이 빨라집니다.', '숫자와 재료명은 제목보다 본문에 더 자세히 적어주세요.']
  },
  share: {
    label: '공유',
    eyebrow: 'Reusable Knowledge',
    intro: '거래처, 표, 운영 팁처럼 다른 메이커가 바로 재사용할 수 있는 실무 자료를 정리하는 글 흐름입니다.',
    valuePitch: '무엇을 공유하는지보다 누가 언제 써먹을 수 있는지가 먼저 드러나야 저장과 재방문이 늘어납니다.',
    boardPulse: '거래처 정리, 공방 계약 팁, 원가표 공유 글 반응이 높습니다.',
    moderationNote: '홍보성 링크보다 요약, 출처, 사용 시점이 선명한 글이 우선 노출됩니다.',
    titlePlaceholder: '[공유] 어떤 자료를 나누고 있나요?',
    templates: [
      {
        id: 'resource-drop',
        label: '자료 공유',
        description: '체크리스트, 표, 링크 묶음을 공유하는 포맷',
        titleSuggestion: '[공유] 종로 부자재 거래처 첫 문의 체크포인트 정리',
        contextSeed:
          '최근 처음 연락한 거래처 8곳을 기준으로 최소 문의 항목과 응답 속도를 비교해봤습니다.',
        detailsSeed:
          '전화보다 문자/메일 응답이 빨랐던 곳, 샘플 최소 수량, 소량 주문 가능 여부를 표로 묶어두었습니다.',
        requestSeed: '비슷한 거래처를 추가로 아는 분은 댓글로 보완해주시면 다음 버전에 반영하겠습니다.',
        tagSeed: ['거래처', '체크리스트', '소싱']
      },
      {
        id: 'ops-tip',
        label: '운영 팁',
        description: '실전 운영 노하우와 시행착오를 묶는 포맷',
        titleSuggestion: '[공유] 플리마켓 하루 전 준비 체크리스트',
        contextSeed:
          '작업물 진열, 결제 동선, 포장재, 동행 스태프 역할을 하루 전 기준으로 다시 정리했습니다.',
        detailsSeed:
          '현장 도착 후 30분 안에 세팅하려면 집에서 미리 끝내야 하는 항목을 시간대별로 구분했습니다.',
        requestSeed: '추가로 빠지기 쉬운 항목이 있으면 알려주세요. 체크리스트에 계속 업데이트할게요.',
        tagSeed: ['플리마켓', '운영', '체크리스트']
      }
    ],
    checklist: [
      {
        id: 'share-source',
        label: '출처와 업데이트 시점을 적었나요?',
        description: '자료의 신뢰도를 판단하는 가장 빠른 기준입니다.'
      },
      {
        id: 'share-usecase',
        label: '누가 언제 쓰면 좋은지 적었나요?',
        description: '독자가 바로 자기 상황에 대입할 수 있어야 저장 가치가 생깁니다.'
      },
      {
        id: 'share-next',
        label: '추가 보완 요청 포인트를 남겼나요?',
        description: '댓글 참여와 공동 업데이트 흐름을 열어두는 장치입니다.'
      }
    ],
    supportNotes: ['표나 문서 링크가 있다면 핵심 요약을 본문에 먼저 적어주세요.', '홍보성 표현보다 사용 맥락과 한계를 분명히 적는 편이 신뢰를 줍니다.']
  },
  free: {
    label: '아무말',
    eyebrow: 'Bench Exchange',
    intro: '작업 근황, 시장 후기, 사소한 잡담을 편하게 남기되 다음 대화를 부르는 흐름으로 정리하는 글 공간입니다.',
    valuePitch: '짧은 글이어도 오늘의 작업 맥락과 한 줄 질문이 있으면 대화가 더 오래 이어집니다.',
    boardPulse: '근황 공유, 작업실 일상, 플리마켓 후기처럼 가볍지만 구체적인 이야기가 잘 붙습니다.',
    moderationNote: '분위기는 가볍게 유지하되 위치, 연락처, 거래 유도 정보는 최소화하는 것이 기본입니다.',
    titlePlaceholder: '[아무말] 오늘 무슨 이야기를 남길까요?',
    templates: [
      {
        id: 'bench-log',
        label: '작업 근황',
        description: '오늘 만든 것과 느낀 점을 남기는 포맷',
        titleSuggestion: '[아무말] 오늘은 체인 샘플만 12개 만져봤어요',
        contextSeed:
          '신상 체인 샘플을 정리하면서 두께와 광택 차이를 계속 비교해보는 날이었습니다.',
        detailsSeed:
          '생각보다 사진보다 실물이 더 예쁜 타입이 많았고, 착용감은 얇은 체인보다 중간 굵기가 훨씬 안정적이었어요.',
        requestSeed: '다들 체인 샘플 정리할 때 어떤 기준으로 먼저 걸러내는지 궁금합니다.',
        tagSeed: ['작업근황', '체인', '샘플']
      },
      {
        id: 'market-story',
        label: '시장 후기',
        description: '행사나 장터 경험을 가볍게 남기는 포맷',
        titleSuggestion: '[아무말] 주말 플리마켓에서 가장 많이 받은 질문',
        contextSeed:
          '이번 주말 플리마켓에서 비슷한 질문이 반복돼서 현장에서 바로 정리해두고 싶었습니다.',
        detailsSeed:
          '가격보다 소재와 관리법을 묻는 분이 많아서 다음엔 안내 카드를 좀 더 크게 준비해보려고 합니다.',
        requestSeed: '행사에서 자주 받는 질문이나 준비 팁이 있으면 같이 나눠주세요.',
        tagSeed: ['플리마켓', '후기', '대화']
      }
    ],
    checklist: [
      {
        id: 'free-context',
        label: '오늘의 맥락을 적었나요?',
        description: '짧은 근황이어도 장소, 상황, 이유가 있으면 공감이 쉬워집니다.'
      },
      {
        id: 'free-hook',
        label: '이어질 질문 한 줄을 넣었나요?',
        description: '댓글을 부르는 장치가 있으면 단순 일기에서 대화로 넘어갑니다.'
      },
      {
        id: 'free-privacy',
        label: '위치·연락처 같은 민감한 정보는 뺐나요?',
        description: '가벼운 글일수록 과한 정보 노출을 줄이는 것이 안전합니다.'
      }
    ],
    supportNotes: ['짧은 글은 제목보다 첫 문장이 더 중요합니다.', '느슨한 대화라도 다음 사람이 답하기 쉬운 질문을 마지막에 붙여보세요.']
  }
};

export function getCommunityComposeTab(input: string | undefined): CommunityTabId {
  return input === 'share' || input === 'free' ? input : 'qna';
}

export function buildCommunityComposeDraft(
  activeTab: CommunityTabId,
  templateId?: string
): CommunityComposeDraft {
  const guide = communityComposeData[activeTab];
  const template =
    guide.templates.find((item) => item.id === templateId) ?? guide.templates[0];

  return {
    activeTab,
    selectedTemplateId: template.id,
    title: template.titleSuggestion,
    context: template.contextSeed,
    details: template.detailsSeed,
    request: template.requestSeed,
    tags: template.tagSeed.join(', '),
    completedChecklistIds: []
  };
}
