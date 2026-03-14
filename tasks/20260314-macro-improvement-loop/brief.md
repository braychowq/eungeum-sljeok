# Brief

- date: 2026-03-14
- task: update the recurring SSUK improvement loop so it prioritizes large, macro-level service improvements instead of small tweaks
- requester: user

## Discovery
- The current recurring automation runs hourly with internal 20-minute subcycles.
- The current prompt and local harness skill still allow relatively small low-risk frontend slices.
- The user wants the loop to prefer large, page-level or flow-level improvements and explicitly allows full-page improvements when useful.

## Scope
- Update the recurring automation prompt.
- Update the local harness skill and policy docs.
- Align agent responsibilities so future cycles choose meaningful page or user-flow improvements.

## Non-goals
- No product UI/code changes in this task.
- No schedule change.
- No backend/API contract change.

## Required outcome
- The recurring loop should prefer:
  - one page-level redesign/improvement
  - or one key user-flow improvement
  - or one tightly connected multi-section improvement slice
- The loop should avoid trivial micro-tweaks unless they are part of a larger coherent change.
