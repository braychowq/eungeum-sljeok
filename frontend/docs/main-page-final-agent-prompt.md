# 메인 페이지 최종 개발 프롬프트 (산출물 포함)

너는 FE 개발 에이전트다. 아래 기준 UI를 그대로 구현하고, 지정된 산출물을 제출하라.

## 1) 목표
- 메인 페이지를 기준 캡처와 동일한 정보 구조/톤/인터랙션으로 구현한다.
- 디자인은 화이트 배경 + 블랙 타이포 + 얇은 보더의 미니멀 톤을 유지한다.
- 와이어프레임 느낌이 아닌 실제 서비스 화면 품질로 완성한다.

## 2) 기준 자료 (Source of Truth)
- Desktop 기준 캡처: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-desktop-v2.png`
- Mobile 기준 캡처: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-mobile-v2.png`
- 현재 기준 코드: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home`

## 3) 고정 섹션 순서 (절대 변경 금지)
1. 상단 네비
2. 배너 캐러셀 (이미지 전용)
3. 슬쩍 얘기하기
4. 슬쩍 공방 쉐어하기
5. 슬쩍 물건 판매하기
6. 슬쩍 정보 공유하기

## 4) 고정 메뉴명 (절대 변경 금지)
- 슬쩍 얘기하기
- 슬쩍 공방 쉐어하기
- 슬쩍 물건 판매하기
- 슬쩍 정보 공유하기

## 5) 기능 요구사항
- 검색 UI 추가 금지 (헤더/배너/본문 모두).
- 배너는 이미지 전용으로만 구성한다.
- 배너 이미지는 클릭 시 링크 이동 가능해야 한다.
- 배너는 자동 롤링 + 좌/우 버튼 + 도트 인디케이터를 유지한다.
- 커뮤니티는 카테고리 버튼 `Q&A`, `자랑`, `공유`로 리스트가 교체되어야 한다.
- 공방/판매 섹션은 세로 게시판 금지.
- 공방/판매 섹션은 이미지 필수 카드 + 가로 슬라이더 구조로 구현한다.

## 6) 디자인 요구사항
- 배경은 흰색 중심.
- 본문 타이포와 보더는 블랙/다크그레이 중심.
- 포인트 색상 최소화, 핵심 버튼만 블랙 채움 사용.
- 카드 UI는 둥근 모서리 + 얇은 보더 + 낮은 시각 밀도를 유지.
- 모바일에서도 동일 톤/구조를 유지.

## 7) 구현 책임 파일
- 엔트리: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/app/page.tsx`
- 조립: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/HomePage.tsx`
- 네비: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/TopNav.tsx`
- 배너: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/BannerCarousel.tsx`
- 커뮤니티: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/CommunitySection.tsx`
- 공방/판매 슬라이더: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/HorizontalCardSlider.tsx`
- 정보 공유: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/InfoLibrarySection.tsx`
- 데이터: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/mockData.ts`
- 스타일: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home/*.module.css`

## 8) 금지사항
- 히어로 텍스트 블록 신규 추가 금지.
- 검색창/검색 인풋 추가 금지.
- 공방/판매를 세로 리스트로 변경 금지.
- 메뉴명을 임의로 수정하거나 영문화 금지.

## 9) 제출해야 할 산출물 (필수)
1. 코드 변경 요약
- 변경 파일 목록 + 각 파일 변경 목적 1줄 설명

2. 실행 검증 결과
- `npm run build` 실행 결과
- 성공 여부와 핵심 로그 요약

3. 결과 스크린샷 (최신)
- Desktop 1장 (폭 1440 기준)
- Mobile 1장 (폭 390 기준)
- 저장 경로를 명시

4. QA 체크리스트 결과
- 아래 항목을 `PASS/FAIL`로 제출
- 섹션 순서 일치
- 메뉴명 일치
- 배너 이미지 전용 구성
- 배너 클릭 이동 동작
- 배너 자동/수동 롤링 동작
- 커뮤니티 탭 전환 동작
- 공방 가로 슬라이더 동작
- 판매 가로 슬라이더 동작
- 검색 UI 부재 확인
- Desktop/Mobile 레이아웃 정상

## 10) 완료 보고 포맷 (그대로 사용)
- 작업 브랜치:
- 변경 파일:
- 구현 요약:
- 빌드 결과:
- 스크린샷 경로:
- QA 결과:
- 잔여 이슈(없으면 없음):
