# Main Page Agent Handoff (Lock Spec)

## 1. 목표
- 현재 구현된 메인 페이지 디자인/구조를 변경 없이 동일 품질로 유지한 채 개발/확장한다.
- 기준 결과물은 아래 캡처와 현재 코드 기준을 모두 만족해야 한다.

## 2. 기준 산출물 (Source of Truth)
- Desktop 캡처: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-desktop-v2.png`
- Mobile 캡처: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-mobile-v2.png`
- 메인 조립: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/HomePage.tsx`
- 카피/데이터: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/mockData.ts`

## 3. 고정 구조 (절대 변경 금지)
1. 상단 네비
2. 배너 캐러셀(이미지만 표시, 클릭 이동)
3. `슬쩍 얘기하기`
4. `슬쩍 공방 쉐어하기`
5. `슬쩍 물건 판매하기`
6. `슬쩍 정보 공유하기`

## 4. 고정 네이밍 (절대 변경 금지)
- 메뉴
- `슬쩍 얘기하기`
- `슬쩍 공방 쉐어하기`
- `슬쩍 물건 판매하기`
- `슬쩍 정보 공유하기`

## 5. 기능 규칙
- 홈 검색 UI는 넣지 않는다.
- 배너는 텍스트 오버레이/카피 영역 없이 이미지 전용으로 구성한다.
- 배너 이미지는 클릭 시 링크 이동 가능해야 한다.
- 배너는 자동 롤링 + 좌/우 버튼 + 도트 인디케이터를 유지한다.
- 커뮤니티는 탭 버튼 `Q&A`, `자랑`, `공유`로 목록이 교체되어야 한다.
- 공방/판매 섹션은 세로 리스트 금지, 가로 슬라이더 카드 구조만 허용한다.
- 공방/판매 카드는 이미지가 반드시 있어야 한다.

## 6. 디자인 규칙
- 톤: 화이트 배경 + 블랙 타이포 + 얇은 라인 보더.
- 포인트 컬러 최소화: 핵심 버튼만 블랙 채움.
- 카드 형태: 라운드 보더 + 얕은 밀도 + 단순 정보 구조.
- 시각 스타일은 스켈레톤/와이어프레임 느낌이 아닌 실제 서비스 UI 수준을 유지.

## 7. 구현 파일 책임
- `/frontend/app/page.tsx`: 메인 엔트리
- `/frontend/components/home/HomePage.tsx`: 섹션 조립
- `/frontend/components/home/TopNav.tsx`: 상단 메뉴
- `/frontend/components/home/BannerCarousel.tsx`: 이미지 롤링 배너
- `/frontend/components/home/CommunitySection.tsx`: 탭 필터 커뮤니티
- `/frontend/components/home/HorizontalCardSlider.tsx`: 공방/판매 가로 카드
- `/frontend/components/home/InfoLibrarySection.tsx`: 정보 공유 리스트
- `/frontend/components/home/*.module.css`: 컴포넌트 스타일

## 8. 완료 조건 (Definition of Done)
- Desktop/Mobile에서 기준 캡처와 동일한 정보 구조와 톤을 유지한다.
- 섹션 순서/메뉴명/라벨이 100% 일치한다.
- 배너/커뮤니티 탭/가로 슬라이더 인터랙션이 정상 동작한다.
- `npm run build` 통과.
- 신규 코드가 있어도 기존 UI 규칙을 깨지 않는다.

## 9. 금지사항
- 신규 히어로 문구 블록 추가 금지.
- 검색창/검색바 추가 금지.
- 공방/판매 영역을 세로 피드 형태로 변경 금지.
- 메뉴명을 영문 또는 다른 표현으로 바꾸는 것 금지.
