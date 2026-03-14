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
5. 원격 기준 최신 `main`을 기준점으로 잡는다.
   - `git fetch origin main` 을 시도한다.
   - 네트워크 또는 fetch 실패 시 이번 서브사이클만 실패로 기록하고 정리 후 종료한다.
6. 임시 작업 브랜치 `codex/ssuk-loop-cycle-<timestamp>`를 `origin/main` 기준으로 생성해 이동한다.
   - 이 브랜치는 PR 용도가 아니라 서브사이클 격리를 위한 임시 브랜치다.
7. 메인/커뮤니티/공방 쉐어 기준으로 개선 후보를 5개 이내로 추린다.
8. 후보를 impact vs risk로 정렬하고, planner 규칙에 따라 아래 셋 중 하나를 우선 선택한다.
   - 한 페이지 전체 개선 1건
   - 하나의 핵심 사용자 흐름 개선 1건
   - 서로 강하게 연결된 섹션/컴포넌트 묶음 개선 1건
9. 단순 미세 수정은 위 거시적 개선의 일부일 때만 허용한다.
10. 선택한 작업이 저위험 프론트엔드 범위면 구현한다.
11. 구현 후 `cd frontend && npm run build`를 실행한다.
12. reviewer 기준으로 검증이 통과했고 실제 변경 파일이 있으면 auto-commit 한다.
13. commit 규칙:
   - 메시지: `chore: ssuk improvement loop <timestamp>`
14. commit 후 PR 없이 직접 배포 브랜치로 푸시한다.
   - push 대상: `git push origin HEAD:main`
   - 즉, 임시 브랜치의 HEAD를 원격 `main`으로 직접 fast-forward 푸시한다.
15. push 실패 시:
   - 실패 원인을 `results.md`에 남긴다.
   - 임시 브랜치는 삭제하거나 버려서 다음 서브사이클에 영향을 남기지 않는다.
   - 이번 서브사이클만 종료한다.
16. 작업 브랜치에서 원래 브랜치로 복귀한다.
17. stash가 있었다면 복원한다.
   - 복원 성공 시 결과에 기록한다.
   - 복원 충돌 시 stash를 보존한 채 중지하고, 수동 확인 필요를 기록한다.
18. 사용한 임시 브랜치는 성공/실패 여부와 무관하게 가능하면 정리한다.
19. 사이클 결과를 `results.md`에 append 한다.

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
- 현재 브랜치/원격 상태 때문에 안전한 push가 보장되지 않는 작업

## Results log format
각 사이클마다 아래를 남긴다.
- cycle timestamp
- repo state summary
- original branch
- stash created/restored status
- temp cycle branch
- candidate improvements
- selected improvement or skip reason
- changed files
- verification result
- commit/push result
- next backlog

## Guardrails
- 절대 destructive git command 사용 금지
- 사용자 변경은 stash로 먼저 보존하고, 직접 revert 하지 않는다
- 자동화는 PR 절차 없이 검증 통과 후 직접 `origin/main` 으로 푸시한다
- direct push는 임시 사이클 브랜치에서 `HEAD:main` 방식으로 수행해 로컬 `main` 오염을 피한다
- 한 사이클에서 미세 수정 여러 개보다 의미 있는 거시적 개선 1건을 우선한다
- 필요하면 페이지 자체를 개선해도 되지만, 변경 이유와 사용자 경험 개선 효과가 분명해야 한다
- build 실패 시 결과에 실패 원인과 롤포워드 후보를 기록
- fetch, push 등 네트워크 실패는 서브사이클 로컬 실패로만 처리하고 다음 실행에 상태를 남기지 않는다
- stash 복원 충돌 시 추가 구현을 중단하고 수동 확인이 필요하다고 기록
