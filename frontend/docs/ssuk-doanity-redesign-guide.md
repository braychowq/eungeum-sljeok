# 슬쩍 커뮤니티/마켓 디자인 개선 지침서 (Doanity 스타일 차용)

## 1. 목표
- 현재 `http://127.0.0.1:3005/community`, `http://127.0.0.1:3005/market`의 와이어프레임형 UI를 실제 서비스형 UI로 전환한다.
- 디자인 방향은 `카드리스 에디토리얼 커머스 UI`로 통일한다.
- 핵심 원칙은 `카테고리 영역을 큰 박스로 감싸지 않고도 시각적으로 명확히 구분`하는 것이다.

## 2. 반드시 지킬 디자인 원칙
1. 섹션 외곽 박스 금지
- `tabSection`, `listSection`, `heroBox`, `topNav`를 감싸는 굵은 보더 박스를 제거한다.
- 섹션 구분은 `타이틀`, `간격`, `배경 톤 변화`, `타이포 위계`로 만든다.

2. 모바일 퍼스트 캔버스
- 콘텐츠 캔버스는 `max-width: 600px`를 기본으로 한다.
- 페이지 배경은 연회색(`#ededed` 계열), 캔버스는 흰색으로 유지한다.

3. 저채도 중립 톤 + 1개 포인트
- 본문은 그레이 스케일 중심.
- 포인트 컬러는 1개만 사용한다. 권장: `#e97502`.
- 활성 상태와 주요 CTA 외 불필요한 채움색 금지.

4. 카테고리 박스 대신 칩/리듬
- 카테고리는 섹션 박스가 아니라 `수평 칩 그룹`으로 표현한다.
- 섹션 사이 `48px~72px` 수직 간격을 고정해서 정보 블록을 분리한다.

5. 카드는 유지하되 경계는 약하게
- 리스트 항목/상품 카드 자체는 유지한다.
- 테두리는 `1px #f0f0f0` 수준으로 약화한다.
- hover는 scale 대신 밝기/그림자 미세 변화만 허용한다.

## 3. 레이아웃/타이포 스펙
1. 글로벌 토큰 (`frontend/app/globals.css`)
- 아래 CSS 변수 추가:
- `--bg-page: #ededed`
- `--bg-canvas: #ffffff`
- `--text-primary: #191919`
- `--text-secondary: #5d5d5d`
- `--line-soft: #f3f3f3`
- `--brand: #e97502`
- `--radius-sm: 8px`
- `--radius-md: 12px`
- `--space-1: 8px`
- `--space-2: 12px`
- `--space-3: 16px`
- `--space-4: 24px`
- `--space-5: 32px`
- `--space-6: 48px`

2. 페이지 스캐폴드
- `TwoMenuShell.page`는 중앙 정렬과 상하 여백만 담당한다.
- `TwoMenuShell.container`는 `max-width: 600px`, `min-height: 100vh`, `background: var(--bg-canvas)`를 사용한다.
- 데스크톱에서 캔버스 그림자(`shadow-lg`)를 주고, 모바일에서는 제거한다.

3. 타이포 위계
- 페이지 타이틀: `28~32px / 700`
- 섹션 타이틀: `30px / 700` 대신 과대하지 않게 `24px / 700`
- 본문/메타: `14px / 400`, 메타는 `12px / 400` + `var(--text-secondary)`
- 탭 칩: `12~13px / 600`

## 4. 컴포넌트별 구현 지침
1. 파일: `frontend/components/ssuk/TwoMenuShell.module.css`
- 제거:
- `.container`, `.topNav`, `.heroBox`의 외곽 보더 강조 스타일
- 추가:
- sticky 헤더(얇은 하단 보더만 유지)
- 히어로 영역은 박스 대신 `padding + margin-bottom`으로 구성
- 모바일 하단 nav는 유지하되 박스 경계 약화
- 완료 기준:
- 페이지 전체에서 큰 사각형 테두리 덩어리가 보이지 않아야 한다.

2. 파일: `frontend/components/ssuk/CommunityView.module.css`
- 제거:
- `.tabSection`, `.listSection` 외곽 박스 스타일
- 추가:
- `section + section` 간 `margin-top: var(--space-6)` 리듬
- 카테고리 칩 래퍼(`tabRow`)는 보더 없는 흐름형 배치
- 게시글 아이템은 `border: 1px solid var(--line-soft)` + 충분한 내부 여백
- 완료 기준:
- 카테고리 영역이 박스 없이도 분리되어 보인다.

3. 파일: `frontend/components/ssuk/MarketView.module.css`
- 제거:
- `.tabSection`, `.listSection` 박스 경계
- 추가:
- 섹션 리듬 간격 + 약한 카드 경계 + 통일된 이미지 비율(`aspect-ratio: 1/1`)
- 모바일에서는 1열 카드, 데스크톱에서는 3열 그리드 유지
- 완료 기준:
- 카드 그리드는 유지되지만 섹션 외곽 박스 없이 매끈한 피드형 인상이 나야 한다.

4. 파일: `frontend/components/ssuk/TwoMenuShell.tsx`
- 개선:
- hero 영역 하단에 `섹션용 설명 카피`를 짧게 유지
- 네비/CTA 라벨은 기존 문구 유지
- 구조 변경 최소화(라우팅/기능 로직 변경 금지)

5. 파일: `frontend/components/ssuk/CommunityView.tsx`, `frontend/components/ssuk/MarketView.tsx`
- 개선:
- 각 섹션의 제목 텍스트를 명시적으로 노출
- 라벨성 텍스트(`게시글 리스트`, `상품/공방 카드`)는 보조 톤으로 축소
- 접근성:
- 탭 링크에 `aria-current="page"` 또는 `aria-selected`에 준하는 상태 표현 추가

## 5. 동작 규칙 (기능 유지)
1. 탭 상태는 URL 쿼리 유지
- 커뮤니티: `?tab=qna|share|free`
- 마켓: `?tab=studio|jewelry`

2. 기존 CTA 이동 유지
- `+ 글 등록` -> `/community/new`
- `+ 판매 등록` -> `/market/new`

3. 마켓 이미지 필수
- `imageUrl` 없는 카드 렌더링 금지 규칙 유지

## 6. 금지사항
- 검색바/검색창 신규 추가 금지
- 다크모드 추가 금지
- 섹션을 두꺼운 보더 박스로 다시 감싸는 구현 금지
- 폰트 스택을 임의로 변경해 한글 가독성 저하 금지
- 쿼리 기반 탭 상태를 로컬 상태로 치환 금지

## 7. QA 체크리스트
1. 디자인
- 대형 외곽 박스 구획이 사라졌는가
- 섹션 구분이 간격/타이포/리듬으로 보이는가
- 포인트 컬러가 과다 사용되지 않았는가

2. 기능
- `/community` 탭 전환과 쿼리 반영이 정상인가
- `/market` 탭 전환과 쿼리 반영이 정상인가
- CTA 링크가 정상 이동하는가

3. 반응형
- 1440폭에서 중앙 캔버스형 레이아웃이 유지되는가
- 390폭에서 하단 네비와 콘텐츠가 겹치지 않는가

4. 빌드
- `cd frontend && npm run build` 성공

## 8. 제출 산출물
1. 변경 파일 목록 + 변경 의도
2. Desktop/Mobile 스크린샷 4장
- Community Desktop
- Community Mobile
- Market Desktop
- Market Mobile
3. 빌드 로그 요약
4. QA 체크 결과(PASS/FAIL)
