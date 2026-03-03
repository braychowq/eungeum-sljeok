# 슬쩍 메뉴 개편 개발 프롬프트 (복붙용)

너는 FE 개발 에이전트다.
아래 기준에 맞춰 `슬쩍 커뮤니티 / 슬쩍 마켓` 화면을 구현하고 산출물을 제출하라.

기준 와이어프레임
- `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-community-v1.png`
- `/Users/guk/Documents/workspace/eungeun-sljeok/wireframe-ssuk-market-v1.png`

핵심 요구사항
1. 대메뉴를 2개로 구성한다.
- 슬쩍 커뮤니티
- 슬쩍 마켓

2. 슬쩍 커뮤니티 화면 구현
- 소카테고리: `Q&A`, `공유`, `아무말`
- `+ 글 등록` 버튼 제공
- 소카테고리별 게시글 목록 렌더링

3. 슬쩍 마켓 화면 구현
- 소카테고리: `공방 쉐어하기`, `쥬얼리 악세사리 마켓`
- `+ 판매 등록` 버튼 제공
- 이미지 필수 카드 목록 렌더링

4. 라우팅/상태
- `/community`, `/market` 라우트 제공
- 쿼리로 탭 상태 유지
- `/community?tab=qna|share|free`
- `/market?tab=studio|jewelry`

5. 디자인 규칙
- 화이트 배경 + 블랙 타이포 + 얇은 보더
- 활성 탭/핵심 CTA만 블랙 채움
- 검색창 추가 금지
- Desktop/Mobile 모두 레이아웃 안정성 확보

구현 제약
- 섹션/메뉴명/탭명은 지정 문구 그대로 사용
- 마켓 카드에서 이미지 없는 항목 렌더링 금지
- 와이어프레임 구조를 임의 변경하지 말 것

필수 제출 산출물
1. 변경 파일 목록 및 변경 이유
2. 실행 결과
- `npm run build` 성공 로그 요약
3. 스크린샷 4장
- 커뮤니티 Desktop
- 커뮤니티 Mobile
- 마켓 Desktop
- 마켓 Mobile
4. QA 결과 (PASS/FAIL)
- 메뉴명 일치
- 커뮤니티 탭 전환 동작
- 마켓 탭 전환 동작
- 등록 버튼 노출 및 이동
- 마켓 카드 이미지 필수 충족
- Desktop/Mobile 레이아웃 정상

완료 보고 포맷
- 작업 브랜치:
- 변경 파일:
- 구현 요약:
- 빌드 결과:
- 스크린샷 경로:
- QA 결과:
- 잔여 이슈:
