# ssuk-improvement-loop

## Purpose
은금슬쩍 개선 루프를 PMO 주도로 1시간마다 반복한다. 각 실행은 정확히 하나의 coherent initiative만 다루며, 제품 성공에 직접 연결되는 기능, 흐름, 신뢰, 운영 기반 개선을 우선한다. 이 루프는 local `main`에서만 동작하고, 검증을 통과한 변경만 `origin/main`으로 직접 반영한다.

## When to use
- 은금슬쩍의 홈, 커뮤니티, 마켓, 등록/상세 흐름, 운영 기반을 매시간 개선할 때
- 자동화나 반복 루프가 현재 상태를 점검하고, 분석부터 기능 추가와 QA까지 같은 절차로 수행해야 할 때

## Inputs
- `.codex/harness/eungeun-sljeok-improvement-loop/request.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/proposal.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/proposal.yaml`
- `.codex/harness/eungeun-sljeok-improvement-loop/results.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/priority-backlog.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/managed-files.json`
- `.codex/harness/eungeun-sljeok-improvement-loop/runtime/agents/`
- current git status
- current repo state

## Workflow
1. `request.md`, `proposal.md`, `proposal.yaml`, 최근 `results.md`, `priority-backlog.md`, `managed-files.json`을 읽는다.
2. `git branch --show-current`와 `git status --short`로 현재 상태를 기록한다.
3. 현재 브랜치가 `main`이 아니면 구현은 시도하지 않는다.
   - 이 경우 report-only 사이클로 전환하고, why blocked를 `results.md`에 남긴다.
4. dirty path를 allowlist 기준으로 분류한다.
   - 항상 허용되는 prefix:
     - `.artifacts/`
     - `.codex/harness/eungeun-sljeok-improvement-loop/`
     - `frontend/.artifacts/`
     - `frontend/app/preview/`
     - `frontend/docs/`
     - `frontend/test-results/`
     - `tasks/`
   - 위 allowlist 밖의 product source가 dirty 또는 untracked 상태면 구현은 시도하지 않는다.
   - 차단 시에는 변경 경로를 기록하고 backlog만 갱신한 뒤 종료한다.
5. 구현 가능 상태라면 홈, 커뮤니티, 마켓, 등록/상세 흐름, backend 기능 공백 기준으로 후보를 최대 5개 정리한다.
6. planner 규칙에 따라 정확히 하나의 initiative를 선택한다.
   - 한 페이지 전체 개선 1건
   - 하나의 핵심 사용자 흐름 개선 1건
   - 제품 성공에 직접 연결되는 기능 추가 1건
   - 서로 강하게 연결된 섹션/컴포넌트 묶음 개선 1건
7. 선택 전에 `managed-files.json`의 `implementation_target_files`를 이번 사이클 대상 파일로 갱신한다.
8. planner는 critical path에 남아 service-scenario-planner와 ux-design-agent의 병렬 제안을 통합한다.
9. implementer는 local `main`에서만 구현한다.
   - `git fetch`, `git pull`, `worktree`, `feature branch`, `temp branch`, `PR`을 사용하지 않는다.
10. safe auto-apply 범위라면 구현한다.
11. 구현 후 touched area에 맞는 검증을 실행한다.
   - 공통: `git diff --check`
   - frontend touched: `cd frontend && npm run build`
   - backend touched: `cd backend && ./mvnw test`
   - 둘 다 touched면 둘 다 실행
   - `frontend/node_modules/.bin/next` 가 없으면 `cd frontend && npm ci`로 같은 workspace 의존성만 복구한다.
12. 실패 처리 규칙:
   - push, install, remote asset access 같은 네트워크 의존 실패면 이번 시간대 로컬 실패로 기록하고 종료한다.
   - 비네트워크 실패면 root cause를 분석하고 안전한 교정 1회 후 같은 검증을 1회만 재시도한다.
   - 같은 실패 범주가 재발하면 원인, 교정 시도, 남은 blocker를 기록하고 종료한다.
13. reviewer가 pass를 선언했고 실제 product change가 있으면 commit 한다.
14. commit 규칙:
   - 메시지: `chore(loop): <short summary>`
15. commit 후 local `main`에서 `git push origin main`으로 직접 푸시한다.
16. push 실패 시:
   - 실패 원인을 `results.md`에 남긴다.
   - 추가 수정 없이 이번 시간대만 종료한다.
17. 사이클 종료 시 `priority-backlog.md`와 `managed-files.json`을 갱신하고, `results.md`에 append 한다.
18. 자동화 결과를 요약하는 inbox item을 남긴다.
19. 아래 조건을 모두 만족하면 요약 뒤에 `::archive-thread{}` 를 붙인다.
   - approval-needed 항목이 없다.
   - allowlist 밖의 dirty source로 인한 blocker가 없다.
   - 사용자가 직접 결정해야 하는 후속 항목이 없다.
   - 결과가 단순 완료 보고이며 추가 deliverable 검토가 필요하지 않다.

## Low-risk auto-apply criteria
- 페이지 레이아웃 재구성
- CTA 흐름과 정보 위계 재설계
- 리스트/카드/탭/필터 UX의 묶음 개선
- 글 작성/상세/문의/등록 흐름 보강
- mock/service integration scaffold 또는 lightweight backend endpoint 추가
- 운영자용 문서/체크리스트/신뢰 설명 보강
- 변경 이유와 기대 효과가 명확하고 위 검증 경로로 확인 가능한 작업

## Approval-needed criteria
- 데이터 모델 변화
- auth, payment, 외부 자격증명, 민감정보 처리
- 콘텐츠 정책/서비스 정책 변경
- 광범위한 라우팅 변경
- destructive migration 또는 persistence schema 변경
- 여러 서비스 영역을 동시에 뒤흔드는 대규모 구조 리팩터
- 현재 브랜치가 `main`이 아닌 상태
- allowlist 밖 product source의 dirty/untracked 상태
- 현재 로컬/원격 상태 때문에 안전한 direct push가 보장되지 않는 작업

## Results log format
각 사이클마다 아래를 남긴다.
- cycle timestamp
- repo state summary
- current branch
- dirty-path evaluation
- candidate improvements
- selected improvement or skip reason
- selected target files
- changed files
- verification result
- failure classification and root-cause analysis when relevant
- retry action and retry result when relevant
- commit/push result
- thread cleanup decision
- next backlog

## Guardrails
- 절대 destructive git command 사용 금지
- 자동화는 PR 절차 없이 검증 통과 후 직접 `origin/main` 으로 푸시한다
- direct push는 검증된 로컬 `main` 에서 `git push origin main` 으로만 수행한다
- `git fetch` 와 `git pull` 을 선행 단계로 사용하지 않는다
- worktree, feature branch, temp branch를 만들지 않는다
- allowlist 밖의 dirty source가 있으면 구현을 멈추고 report-only 로 종료한다
- 한 사이클에서 미세 수정 여러 개보다 의미 있는 개선 1건을 우선한다
- 변경 이유와 사용자 경험 또는 제품 성공 기여도가 분명해야 한다
- build 실패 시 결과에 실패 원인과 롤포워드 후보를 기록
- push 등 네트워크 실패는 시간대 로컬 실패로만 처리하고 다음 실행에 상태를 남기지 않는다
- 비네트워크 실패는 원인을 분석하고 안전한 범위의 1회 재시도 후에도 해결되지 않으면 종료한다
- 자동화 쓰레드는 결과가 완결되고 사용자 액션이 남지 않을 때만 정리한다
