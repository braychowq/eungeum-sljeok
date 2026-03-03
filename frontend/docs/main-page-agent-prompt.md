# 개발 에이전트 전달용 프롬프트 (복붙용)

아래 경로의 기준 UI를 그대로 유지한 채 개발해 주세요.

기준
- Desktop: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-desktop-v2.png`
- Mobile: `/Users/guk/Documents/workspace/eungeun-sljeok/home-design-mobile-v2.png`
- 코드 기준: `/Users/guk/Documents/workspace/eungeun-sljeok/frontend/components/home`

요구사항
1. 섹션 순서 고정
- 상단 네비
- 배너 캐러셀(이미지 전용)
- 슬쩍 얘기하기
- 슬쩍 공방 쉐어하기
- 슬쩍 물건 판매하기
- 슬쩍 정보 공유하기

2. 메뉴명 고정
- 슬쩍 얘기하기
- 슬쩍 공방 쉐어하기
- 슬쩍 물건 판매하기
- 슬쩍 정보 공유하기

3. 기능 고정
- 검색 UI 추가 금지
- 배너: 이미지 클릭 이동 + 자동 롤링 + 좌/우 + 도트
- 커뮤니티: `Q&A / 자랑 / 공유` 탭 전환
- 공방/판매: 이미지 필수 가로 슬라이더 카드

4. 디자인 고정
- 화이트 배경 + 블랙 타이포 + 얇은 보더
- 단순하고 밀도 낮은 카드형 UI
- 와이어프레임 느낌 금지(실제 서비스 화면 수준 유지)

검증
- `npm run build` 통과
- Desktop/Mobile 모두 기준 캡처와 구조/톤 일치
