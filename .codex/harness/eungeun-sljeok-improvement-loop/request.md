# 은금슬쩍 PMO 메인라인 개선 팀 요청

## 요청 요약
- 은금슬쩍의 현재 상태를 분석하고, 운영하면서 적극적으로 디벨롭하는 에이전트 팀을 만든다.
- 역할은 `PMO(planner)`, `서비스 기획자`, `숙련 UX/웹디자이너`, `개발자`, `QA`로 구성한다.
- 단순 버그 수정이 아니라 프로젝트 성공에 필요한 기능, 전환 흐름, 운영 장치, 신뢰 요소까지 매시간 반복적으로 발굴하고 발전시킨다.

## 핵심 운영 원칙
- `worktree`, `feature branch`, `temp branch`, `PR`을 만들지 않는다.
- 현재 로컬 `main`만 기준으로 사용한다.
- 검증 통과 후에만 로컬 `main`에서 직접 커밋하고 `git push origin main` 으로 반영한다.
- 매시간 실행은 정확히 하나의 `coherent initiative`만 처리한다.
- 작은 cosmetic tweak 여러 개보다 서비스 성공에 직접 연결되는 기능 추가나 사용자 흐름 개선 1건을 우선한다.

## 현재 서비스 베이스라인
- frontend는 홈, 커뮤니티, 마켓의 주요 화면 셸과 일부 상세 화면이 구현돼 있다.
- `/community/new`, `/market/new` 는 아직 placeholder 수준이다.
- backend는 현재 `/api/health` 중심의 최소 골격만 존재한다.
- 따라서 이 루프는 디자인 손질뿐 아니라 `기획 -> 기능 추가 -> 검증 -> 운영 backlog 관리`까지 포함해야 한다.

## 안전 제약
- repo-local harness 규약이 없으므로 fallback artifact contract를 사용한다.
- 기본 검증은 `cd frontend && npm run build`, backend touched 시 `cd backend && ./mvnw test`, 공통 `git diff --check`를 사용한다.
- 아래 경로는 반복 실행에서 보조 산출물 또는 비주요 작업 경로로 간주해 dirty여도 허용한다.
  - `.artifacts/`
  - `.codex/harness/eungeun-sljeok-improvement-loop/`
  - `frontend/.artifacts/`
  - `frontend/app/preview/`
  - `frontend/docs/`
  - `frontend/test-results/`
  - `tasks/`
- 위 allowlist 밖의 product source가 dirty 또는 untracked 상태면 해당 시간대에는 구현하지 않고 분석과 기록만 수행한다.
