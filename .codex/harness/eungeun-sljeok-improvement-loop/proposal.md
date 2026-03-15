# Harness Proposal

## Task summary
은금슬쩍을 분석하고 운영하는 PMO 중심 에이전트 팀을 만든다. 이 팀은 매시간 현재 서비스 상태를 진단하고, 제품 성공 가능성을 높이는 개선안을 찾은 뒤, 안전하게 검증 가능한 범위에서는 local `main`에 직접 반영하고 즉시 `origin/main`으로 푸시한다. 범위는 홈, 커뮤니티, 마켓에 더해 작성/상세/등록 흐름, 신뢰 장치, 운영 기반, 그리고 가벼운 backend/API 보강까지 포함한다. 단, 승인 없는 대규모 정책 변경이나 고위험 구조 변경은 backlog로 남긴다.

## Proposed task-local skill
- name: `ssuk-improvement-loop`
- purpose: PMO 주도의 은금슬쩍 메인라인 개선 사이클을 매시간 같은 규칙으로 수행하는 런타임 전용 스킬
- location: `.codex/harness/eungeun-sljeok-improvement-loop/runtime/skills/ssuk-improvement-loop/`
- promotion_candidate: yes

## Proposed agents
1. `planner`
   - agent_type: `default`
   - capability_profile: `pmo-orchestrator`
   - recommended_model: `gpt-5.4`
   - reasoning_effort: `high`
   - responsibility: 우선순위, KPI 관점, 승인 경계, mainline 안전성, 결과 통합을 총괄한다.
   - expected_inputs: current repo state, previous results, priority backlog, managed-files state
   - expected_output_or_handoff: cycle brief, selected initiative, completion report
2. `service-scenario-planner`
   - agent_type: `default`
   - capability_profile: `service-growth-planner`
   - recommended_model: `gpt-5.4`
   - reasoning_effort: `high`
   - responsibility: 사용자 여정, 기능 공백, 전환 병목, 운영 신뢰 요소를 기준으로 개선 후보를 발굴한다.
   - expected_inputs: planner brief, current routes/components, existing specs/docs, prior results
   - expected_output_or_handoff: prioritized feature and flow recommendations
3. `ux-design-agent`
   - agent_type: `default`
   - capability_profile: `ux-web-design-lead`
   - recommended_model: `gpt-5.4`
   - reasoning_effort: `medium`
   - responsibility: IA, CTA 위계, 인터랙션, 반응형, 비주얼 시스템 일관성을 설계한다.
   - expected_inputs: planner brief, scenario notes, current CSS/components
   - expected_output_or_handoff: implementation-ready UX and design notes
4. `implementer`
   - agent_type: `worker`
   - capability_profile: `mainline-fullstack-implementer`
   - recommended_model: `gpt-5.3-codex`
   - reasoning_effort: `medium`
   - responsibility: 이번 시간대에 선택된 한 개 initiative를 local `main`에서 구현한다.
   - expected_inputs: planner decision, design/spec notes, target files, verification gates
   - expected_output_or_handoff: code changes and verification notes
5. `reviewer`
   - agent_type: `default`
   - capability_profile: `qa-release-reviewer`
   - recommended_model: `gpt-5.4`
   - reasoning_effort: `high`
   - responsibility: QA 관점에서 회귀, acceptance, release readiness를 검토한다.
   - expected_inputs: diff, build/test output, planner brief, UX acceptance notes
   - expected_output_or_handoff: findings, pass/revise recommendation, residual risks

## Execution order
1. `planner`가 `results.md`, `priority-backlog.md`, `managed-files.json`, 현재 repo 상태를 읽고 이번 시간대 후보를 좁힌다.
2. `service-scenario-planner`와 `ux-design-agent`가 병렬로 분석한다.
3. `planner`가 둘의 산출물을 합쳐 정확히 하나의 initiative를 고르거나, 안전하지 않으면 report-only 사이클로 낮춘다.
4. `implementer`가 local `main`에서만 구현한다.
5. `reviewer`가 QA와 push 가능 여부를 판정한다.
6. `planner`가 결과, backlog, managed-files 상태를 갱신한다.

## Artifacts to create after approval
- `.codex/harness/eungeun-sljeok-improvement-loop/request.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/proposal.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/proposal.yaml`
- `.codex/harness/eungeun-sljeok-improvement-loop/results.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/priority-backlog.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/managed-files.json`
- `.codex/harness/eungeun-sljeok-improvement-loop/runtime/agents/*.md`
- `.codex/harness/eungeun-sljeok-improvement-loop/runtime/skills/ssuk-improvement-loop/SKILL.md`
- `/Users/guk/.codex/automations/ssuk-2h-loop/automation.toml` update

## Verification path
- harness 아티팩트와 런타임 에이전트 브리프가 모두 존재하는지 확인한다.
- 스킬과 자동화 프롬프트가 `local main only`, `no worktree/feature/temp branch`, `one coherent initiative per hour`, `verify before direct push`를 강제하는지 확인한다.
- baseline audit 1회를 실행해 초기 backlog와 mainline 차단 조건이 기록되는지 확인한다.

## Approval
Approved by user on 2026-03-15 22:04 KST.
