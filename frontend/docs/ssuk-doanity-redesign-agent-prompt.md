# 슬쩍 커뮤니티/마켓 Doanity 스타일 개편 프롬프트 (복붙용)

너는 FE 개발 에이전트다.
아래 기준에 따라 `http://127.0.0.1:3005`의 커뮤니티/마켓 화면을 즉시 개편하고 산출물을 제출하라.

## 목표
- `슬쩍 커뮤니티`, `슬쩍 마켓`을 `카드리스 에디토리얼 커머스 UI`로 리디자인한다.
- 핵심은 `카테고리 영역을 박스로 감싸지 않고 시각적으로 분리`하는 것이다.

## 기준 문서 (Source of Truth)
- 디자인 지침서:
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/docs/ssuk-doanity-redesign-guide.md`
- 참고 와이어프레임:
- `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-community-v1.png`
- `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-market-v1.png`

## 수정 대상 파일 (반드시 우선 반영)
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/app/globals.css`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/TwoMenuShell.tsx`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/TwoMenuShell.module.css`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/CommunityView.tsx`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/CommunityView.module.css`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/MarketView.tsx`
- `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/ssuk/MarketView.module.css`

## 구현 요구사항
1. 박스리스 섹션화
- `tabSection`, `listSection`, `heroBox`, `topNav`의 두꺼운 외곽 보더를 제거한다.
- 섹션 분리는 `타이틀 + 여백 리듬 + 텍스트 위계 + 약한 배경 대비`로 구현한다.

2. 스타일 토큰화
- `globals.css`에 색상/간격 CSS 변수를 추가하고 모듈 CSS에서 재사용한다.
- 포인트 컬러는 `#e97502` 1개만 사용한다.

3. 레이아웃
- 모바일 퍼스트.
- 콘텐츠 캔버스 폭은 `max-width: 600px`.
- 데스크톱은 중앙 캔버스 + 은은한 그림자.
- 모바일은 그림자 제거 + 하단 네비 겹침 방지.

4. 기능 유지
- 탭 쿼리 상태 유지:
- `/community?tab=qna|share|free`
- `/market?tab=studio|jewelry`
- CTA 유지:
- `/community/new`, `/market/new`
- 마켓 카드에서 이미지 없는 항목 렌더링 금지 유지.

5. 접근성
- 활성 탭 상태를 `aria-current` 또는 `aria-selected`로 명시.
- 이미지 alt 유지.
- 모바일 터치 타겟 44px 이상 확보.

## 금지사항
- 검색창/검색바 추가 금지.
- 다크모드 추가 금지.
- 섹션을 다시 두꺼운 박스로 감싸는 구현 금지.
- 기존 메뉴명/탭명 변경 금지.

## 실행 및 검증
1. 실행
- `cd /Users/guk/Documents/workspace/eungeun-sljeok/frontend`
- `npm run build`

2. 캡처
- Desktop: 1440폭
- Mobile: 390폭
- 다음 4장을 저장:
- Community Desktop
- Community Mobile
- Market Desktop
- Market Mobile

## 제출 포맷 (반드시 준수)
- 작업 브랜치:
- 변경 파일:
- 구현 요약:
- 빌드 결과:
- 스크린샷 경로:
- QA 결과:
- 잔여 이슈(없으면 없음):
