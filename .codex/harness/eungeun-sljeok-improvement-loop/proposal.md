# Harness Proposal

## Task summary
은금슬쩍 전면 개선을 위한 approval-gated 에이전트팀과 반복 개선 루프를 만든다. 기본 범위는 frontend-first이며, 반복 루프는 `현황 진단 -> 후보 정리 -> 우선순위 선택 -> 구현 -> 검수 -> 결과 기록` 구조로 운영한다. 현재 운영 기준은 `1시간마다 실행 + 실행 안에서 20분 간격 서브사이클`, `검증 후 PR 없이 direct push`, 그리고 `작은 수정 대신 페이지/흐름 단위 거시적 개선 우선`이다.

## Proposed task-local skill
- name: `ssuk-improvement-loop`
- purpose: 은금슬쩍 개선 사이클을 일관된 절차로 반복 수행하는 런타임 전용 스킬
- location: `.codex/harness/eungeun-sljeok-improvement-loop/runtime/skills/ssuk-improvement-loop/`
- promotion_candidate: yes

## Proposed agents
- `planner`: 팀장, 우선순위와 승인 경계를 관리하고 사이클 결과를 통합한다.
- `service-scenario-planner`: 서비스 흐름, 전환, IA 기준 개선 포인트를 도출한다.
- `ux-design-agent`: 시각 체계, CTA 위계, 컴포넌트 표면과 타이포를 정리한다.
- `implementer`: 승인된 저위험 작업을 실제 코드로 반영한다.
- `reviewer`: 빌드, 회귀 위험, acceptance 관점에서 검수한다.

## Execution order
1. planner가 현재 상태와 backlog를 읽고 이번 사이클 범위를 확정한다.
2. service-scenario-planner와 ux-design-agent가 병렬 분석한다.
3. planner가 이번 사이클 작업을 최종 선택한다.
4. implementer가 저위험 작업만 반영한다.
5. reviewer가 검수한다.
6. planner가 결과와 backlog를 기록한다.

## Artifacts to create after approval
- `request.md`
- `proposal.md`
- `proposal.yaml`
- `results.md`
- `runtime/agents/*.md`
- `runtime/skills/ssuk-improvement-loop/SKILL.md`

## Verification path
- 런타임 하네스 파일이 모두 생성되는지 확인한다.
- 에이전트 역할과 핸드오프 계약이 문서로 정의되어 있는지 확인한다.
- 반복 실행용 스킬이 dirty worktree 안전장치, build 검증, direct push 격리 규칙을 포함하는지 확인한다.

## Approval
Approved by user on 2026-03-14 (Asia/Seoul).
