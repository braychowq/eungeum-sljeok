# Home Component Structure

## 1) 컴포넌트 트리

```text
app/page.tsx
└─ components/home/HomePage.tsx
   ├─ TopNav.tsx
   ├─ BannerCarousel.tsx
   ├─ CommunitySection.tsx
   ├─ HorizontalCardSlider.tsx (공방 쉐어)
   └─ HorizontalCardSlider.tsx (중고 마켓)
```

## 2) 파일 구성

- `components/home/types.ts`: 공통 타입 정의
- `components/home/mockData.ts`: 메인 페이지 샘플 데이터
- `components/home/HomePage.tsx`: 페이지 조립(레이아웃 컨테이너)
- `components/home/TopNav.tsx`: 로고/네비/알림 버튼
- `components/home/BannerCarousel.tsx`: 링크형 배너 롤링
- `components/home/CommunitySection.tsx`: 카테고리 탭 + 게시글 리스트
- `components/home/HorizontalCardSlider.tsx`: 이미지+제목 카드 가로 슬라이더
- `components/home/*.module.css`: 컴포넌트별 스타일 분리

## 3) 핵심 Props

### TopNav

- `items: NavItem[]`
- 역할: 상단 고정 내비게이션 렌더링 (검색 UI 없음)

### BannerCarousel

- `items: BannerItem[]`
- `autoplayMs?: number`
- 역할: 자동 롤링 + 화살표 이동 + 도트 페이지네이션

### CommunitySection

- `posts: CommunityPost[]`
- 역할: `Q&A / 자랑 / 공유` 버튼으로 리스트 필터링

### HorizontalCardSlider

- `id: string`
- `title: string`
- `cards: SliderCard[]`
- 역할: 이미지 필수 카드(이미지 영역 + 제목) 가로 스크롤

## 4) 상태/이벤트

- `BannerCarousel`
- 상태: `activeIndex`
- 이벤트: 자동 롤링, 이전/다음 버튼, 도트 클릭

- `CommunitySection`
- 상태: `activeTab`
- 이벤트: 카테고리 버튼 클릭 시 게시글 목록 교체

- `HorizontalCardSlider`
- 상태: 없음(스크롤 위치는 DOM 관리)
- 이벤트: 좌/우 버튼 클릭 시 `scrollBy` 수행

## 5) 요구사항 반영 체크

- 홈 영역 검색 제거: `TopNav`, `BannerCarousel`에서 검색 필드 미사용
- 배너 롤링 링크 구조: `BannerCarousel` 구현 완료
- 커뮤니티 카테고리 버튼: `CommunitySection` 탭 구현 완료
- 공방/중고마켓 이미지+제목 가로 구조: `HorizontalCardSlider` 공통 컴포넌트로 적용 완료
