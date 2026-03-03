# 슬쩍 커뮤니티/마켓 구현 지침서 (개발 에이전트용)

## 1. 목적
- 대메뉴를 `슬쩍 커뮤니티`, `슬쩍 마켓` 2개로 단순화한다.
- 와이어프레임 기준 UI/동작을 구현하고 Desktop/Mobile에서 동일한 정보 구조를 유지한다.

## 2. 기준 와이어프레임 (Source of Truth)
- 커뮤니티: `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-community-v1.png`
- 마켓: `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-market-v1.png`

## 3. 고정 정보구조
1. 대메뉴
- 슬쩍 커뮤니티
- 슬쩍 마켓

2. 슬쩍 커뮤니티 소카테고리
- Q&A
- 공유
- 아무말

3. 슬쩍 마켓 소카테고리
- 공방 쉐어하기
- 쥬얼리 악세사리 마켓

## 4. 라우팅 규칙
- `/community`: 슬쩍 커뮤니티 메인
- `/market`: 슬쩍 마켓 메인
- 소카테고리 상태는 URL 쿼리로 관리
- 커뮤니티: `/community?tab=qna|share|free`
- 마켓: `/market?tab=studio|jewelry`
- 글 등록/판매 등록 진입 버튼 필요
- 커뮤니티 등록: `/community/write?tab=...`
- 마켓 등록: `/market/write?tab=...`

## 5. 컴포넌트 구조
- `components/ssuk/GlobalNav.tsx`
- `components/ssuk/PageHeader.tsx`
- `components/ssuk/SubcategoryTabs.tsx`
- `components/ssuk/CommunityPostList.tsx`
- `components/ssuk/MarketCardGrid.tsx`
- `components/ssuk/MobileBottomNav.tsx`

## 6. 페이지별 UI 요구사항
### 6-1. 슬쩍 커뮤니티
- 상단에 대메뉴 탭에서 `슬쩍 커뮤니티` 활성 상태 표시.
- 페이지 헤더에 `슬쩍 커뮤니티` 제목과 `+ 글 등록` 버튼 표시.
- 소카테고리 탭(`Q&A`, `공유`, `아무말`) 제공.
- 선택 탭 기준 게시글 리스트 렌더링.
- 카드 정보 최소 항목
- 제목
- 메타(댓글 수, 반응 수, 시간)

### 6-2. 슬쩍 마켓
- 상단에 대메뉴 탭에서 `슬쩍 마켓` 활성 상태 표시.
- 페이지 헤더에 `슬쩍 마켓` 제목과 `+ 판매 등록` 버튼 표시.
- 소카테고리 탭(`공방 쉐어하기`, `쥬얼리 악세사리 마켓`) 제공.
- 카드형 목록 렌더링.
- 카드 필수 항목
- 이미지 (필수)
- 제목
- 상세 진입 버튼

## 7. 디자인 가이드
- 톤: 화이트 배경, 블랙/다크그레이 텍스트, 얇은 보더.
- 강조: 활성 탭/주요 CTA만 블랙 채움.
- 금지: 검색창, 과한 컬러, 스켈레톤 느낌의 미완성 UI.
- 카드: 라운드 보더, 균일한 간격, 텍스트 과밀 금지.

## 8. 반응형 기준
- Desktop 기준폭: 1280~1440
- Mobile 기준폭: 360~390
- 모바일에서도 동일 섹션 순서와 동일 기능 제공.

## 9. 상태 관리 규칙
- 탭 선택 상태는 로컬 상태만 쓰지 말고 URL 쿼리와 동기화.
- 페이지 새로고침 후에도 선택된 소카테고리 유지.

## 10. 접근성/품질
- 탭 버튼에 `aria-selected` 적용.
- 이미지 alt 필수.
- 터치 타겟 44px 이상.
- 키보드 포커스 표시 유지.

## 11. 완료 기준 (DoD)
- 와이어프레임 2종과 동일한 구조/네이밍/주요 동작 구현.
- 커뮤니티 소카테고리 전환 동작 정상.
- 마켓 소카테고리 전환 동작 정상.
- 등록 버튼 진입 경로 정상.
- Desktop/Mobile 캡처 제출.
- `npm run build` 성공.

## 12. 제출 산출물
1. 변경 파일 목록 + 변경 목적
2. 구현 결과 스크린샷 4장
- 커뮤니티 Desktop
- 커뮤니티 Mobile
- 마켓 Desktop
- 마켓 Mobile
3. `npm run build` 결과 로그 요약
4. QA 체크 결과(PASS/FAIL)
