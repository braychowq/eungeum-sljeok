# ssuk-improvement-loop

## Purpose
은금슬쩍 개선 루프를 1시간마다 반복하되, 각 실행 안에서 20분 간격 서브사이클까지 포함해 같은 절차와 안전 규칙으로 분석, 선택, 구현, 검수를 수행한다. 이 루프는 작은 미세 수정보다 페이지/흐름 단위의 거시적 개선을 우선한다.

## When to use
- 은금슬쩍의 메인, 슬쩍 커뮤니티, 공방 쉐어를 주기적으로 개선할 때
- 자동화나 반복 루프가 현재 상태를 점검하고 서비스 수준의 큰 개선을 안전하게 반영해야 할 때

## Inputs
- `.codex/harness/eungeun-sljeok-improvement-loop/request.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/proposal.yaml`
- `.codex/harness/eungeun-sljeok-improvement-loop/results.md`
- current git status
- current repo state

## Workflow
1. `results.md`의 최근 사이클과 backlog를 읽는다.
2. `git status --short`로 작업 트리를 확인한다.
3. 현재 브랜치를 기록한다.
4. dirty worktree 판단:
   - tracked 또는 untracked 변경이 있으면 `git stash push -u -m "ssuk-loop-precycle-<timestamp>"` 로 안전하게 보존한다.
   - stash 생성 여부와 원래 브랜치를 이번 사이클 로그에 기록한다.
5. 원격 fetch 없이 로컬 기준점부터 해석한다.
   - 기본 기준점은 로컬 추적 ref `origin/main` 이다.
   - `origin/main` 이 없고 로컬 `main` 이 있으면 `main` 을 기준점으로 사용한다.
   - 현재 `HEAD` 가 이미 `origin/main` 또는 `main` 과 같다면 latest 기준으로 간주하고 추가 fetch 없이 진행한다.
   - 사용자가 이 자동화 외부에서 브랜치를 조작하지 않는 전제를 우선 사용한다.
   - 로컬 기준 ref 둘 다 없을 때만 `git fetch origin main` 을 시도한다.
   - 이 예외 fetch 는 DNS/일시 네트워크 오류처럼 재시도로 해소 가능한 유형이면 짧게 다시 시도해 총 2회까지 확인한다.
   - 예외 fetch 가 2회 모두 실패하면 이번 서브사이클만 실패로 기록하고 정리 후 종료한다.
6. 로컬 `main` 에서 직접 작업할 수 있는 상태를 만든다.
   - 현재 브랜치가 `main` 이 아니면 `git switch main` 으로 이동한다.
   - 로컬 `main` 이 없고 로컬 `origin/main` 이 있으면 `git switch -c main --track origin/main` 으로 `main` 을 만든다.
   - 로컬 `main` 과 로컬 `origin/main` 이 모두 있으면, 네트워크 없이 아는 최신 상태를 반영하기 위해 `git merge --ff-only origin/main` 으로 로컬 `main` 을 fast-forward 시도한다.
   - 브랜치 전환 또는 fast-forward 가 안전하게 되지 않으면 이번 서브사이클만 실패로 기록하고 정리 후 종료한다.
7. 메인/커뮤니티/공방 쉐어 기준으로 개선 후보를 5개 이내로 추린다.
8. 후보를 impact vs risk로 정렬하고, planner 규칙에 따라 아래 셋 중 하나를 우선 선택한다.
   - 한 페이지 전체 개선 1건
   - 하나의 핵심 사용자 흐름 개선 1건
   - 서로 강하게 연결된 섹션/컴포넌트 묶음 개선 1건
9. 단순 미세 수정은 위 거시적 개선의 일부일 때만 허용한다.
10. 선택한 작업이 저위험 프론트엔드 범위면 구현한다.
11. 구현 후 `cd frontend && npm run build`를 실행한다.
   - 실행 전에 `frontend/node_modules/.bin/next` 가 없으면 `cd frontend && npm ci` 로 이 worktree의 의존성을 먼저 복구한다.
12. 실패 처리 규칙:
   - 예외 fetch, push, install, remote asset access 등 네트워크 의존 실패면, 원격 부작용이 없는 명령에 한해 짧은 재시도 1회를 먼저 수행한다.
   - 재시도 후에도 같은 네트워크 실패가 반복되면 이번 서브사이클만 실패로 기록하고 정리 후 종료한다.
   - 네트워크 실패가 아니라면 실패 원인을 분류하고 root cause를 분석한다.
   - 안전한 범위의 교정이 가능하면 같은 서브사이클 안에서 1회만 수정 후 재시도한다.
   - 재시도 후에도 같은 범주의 실패가 반복되면 원인, 시도한 교정, 남은 blocker를 기록하고 이번 서브사이클을 종료한다.
13. reviewer 기준으로 검증이 통과했고 실제 변경 파일이 있으면 로컬 `main` 에 auto-commit 한다.
14. commit 규칙:
   - 메시지: `chore: ssuk improvement loop <timestamp>`
15. commit 후 PR 없이 직접 배포 브랜치로 푸시한다.
   - push 대상: `git push origin main`
   - 즉, 로컬 `main` 의 검증된 커밋을 원격 `main`으로 직접 푸시한다.
16. push 실패 시:
   - 실패 원인을 `results.md`에 남긴다.
   - 이번 서브사이클만 종료한다.
17. 현재 브랜치가 원래 브랜치와 다르면 원래 브랜치로 복귀한다.
18. stash가 있었다면 복원한다.
   - 복원 성공 시 결과에 기록한다.
   - 복원 충돌 시 stash를 보존한 채 중지하고, 수동 확인 필요를 기록한다.
19. 사이클 결과를 `results.md`에 append 한다.
20. 자동화 결과를 요약하는 inbox item을 남긴다.
21. 아래 조건을 모두 만족하면 요약 뒤에 `::archive-thread{}` 를 붙여 쓰레드를 정리한다.
   - approval-needed 항목이 없다.
   - stash 복원 충돌이나 브랜치 복귀 실패가 없다.
   - 사용자가 직접 선택해야 하는 후속 결정을 남기지 않았다.
   - 결과가 단순 완료 보고이며 추가 deliverable 검토를 요구하지 않는다.

## Low-risk auto-apply criteria
- 페이지 레이아웃 재구성
- 섹션 순서 변경
- CTA 흐름과 정보 위계 재설계
- 리스트/카드/탭/필터 UX의 묶음 개선
- 한 페이지 전체의 비주얼/컴포넌트 체계 정리
- 상세/목록을 묶은 흐름 개선
- routing, API, persistence, auth, backend behavior를 바꾸지 않는 작업
- 변경 이유와 기대 효과가 명확하고 build로 검증 가능한 작업

## Approval-needed criteria
- backend 영향
- 데이터 모델 변화
- 콘텐츠 정책/서비스 정책 변경
- 광범위한 라우팅 변경
- 여러 서비스 영역을 동시에 뒤흔드는 대규모 구조 리팩터
- stash 복원 충돌이 발생한 상태
- 현재 브랜치 전환이나 로컬 `main` fast-forward 가 안전하게 되지 않는 상태
- 현재 브랜치/원격 상태 때문에 안전한 push가 보장되지 않는 작업

## Results log format
각 사이클마다 아래를 남긴다.
- cycle timestamp
- repo state summary
- original branch
- stash created/restored status
- main branch handling
- candidate improvements
- selected improvement or skip reason
- changed files
- verification result
- failure classification and root-cause analysis when relevant
- retry action and retry result when relevant
- commit/push result
- thread cleanup decision
- next backlog

## Guardrails
- 절대 destructive git command 사용 금지
- 사용자 변경은 stash로 먼저 보존하고, 직접 revert 하지 않는다
- 자동화는 PR 절차 없이 검증 통과 후 직접 `origin/main` 으로 푸시한다
- direct push는 검증된 로컬 `main` 에서 `git push origin main` 으로 수행한다
- normal run에서는 `git fetch origin main` 을 선행하지 않고, 로컬 `origin/main` 또는 `main` ref 를 기준으로 작업한다
- fetch 는 로컬 기준 ref 가 없을 때만 수행하는 예외 절차로 제한한다
- 브랜치 전환과 fast-forward 가 안전하지 않으면 해당 서브사이클은 바로 종료하고 상태만 기록한다
- 한 사이클에서 미세 수정 여러 개보다 의미 있는 거시적 개선 1건을 우선한다
- 필요하면 페이지 자체를 개선해도 되지만, 변경 이유와 사용자 경험 개선 효과가 분명해야 한다
- build 실패 시 결과에 실패 원인과 롤포워드 후보를 기록
- fetch, push 등 네트워크 실패는 서브사이클 로컬 실패로만 처리하고 다음 실행에 상태를 남기지 않는다
- 비네트워크 실패는 원인을 분석하고 안전한 범위의 1회 재시도 후에도 해결되지 않으면 종료한다
- stash 복원 충돌 시 추가 구현을 중단하고 수동 확인이 필요하다고 기록
- 자동화 쓰레드는 결과가 완결되고 사용자 액션이 남지 않을 때만 정리한다
