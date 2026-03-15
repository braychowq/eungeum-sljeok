# SSUK Priority Backlog

Updated: 2026-03-15 22:04 KST

## Current Top Priorities
1. Replace placeholder authoring flows with real product experiences.
   - Scope: `/community/new`, `/market/new`
   - Why now: the current service can be browsed but not meaningfully used to create value.
   - Success signal: users can start a post or studio listing with a guided form instead of a placeholder screen.
2. Introduce a lightweight data/service layer between UI shells and backend capability.
   - Scope: frontend data access contract, lightweight backend endpoints, mock-to-API migration path
   - Why now: current pages rely on static mock data, which blocks product readiness and future iteration speed.
   - Success signal: at least one visible flow reads from a stable API or structured service abstraction.
3. Strengthen trust and conversion in studio share flows.
   - Scope: studio detail, inquiry affordances, host onboarding guidance, policy/trust surfacing
   - Why now: market browse UX improved, but end-to-end booking confidence is still shallow.
   - Success signal: clearer next action, policy visibility, and inquiry decision support.
4. Close the loop from community consumption to participation.
   - Scope: post detail, compose entry points, contribution prompts, category continuity
   - Why now: list and highlight UX improved, but authoring and contribution momentum is incomplete.
   - Success signal: stronger path from reading to writing with reduced friction.
5. Define a minimal operating layer for moderation and service health.
   - Scope: reporting/moderation concepts, operator checklist, core metrics surface, basic admin/API hooks
   - Why now: recurring development should not outpace the platform's ability to operate safely.
   - Success signal: clear baseline for moderation, health, and release readiness.

## Baseline Blockers For Unattended Mainline
1. Fix misleading detail routing and fallback behavior before trusting direct-main iteration.
   - Community lists many IDs but only a few detail payloads exist, and unknown IDs silently fall back to `qna-1`.
   - Studio cards for `studio-3` and `studio-4` currently route to other studios.
2. Align local API defaults before backend-linked automation work.
   - `frontend/next.config.ts` rewrites to port `8081` by default while backend defaults to `8080`.
   - Add at least one `/api/health` smoke through the Next rewrite before backend-integrated unattended cycles.
3. Expand verification depth beyond build/context smoke.
   - Add route-smoke coverage for primary CTA destinations.
   - Add backend endpoint tests beyond `contextLoads`.
   - Add at least one browser-level acceptance path for home, community, market, and detail flows.

## Approval-Needed / Later
- Auth, role permissions, or persistent user identity
- External integrations requiring credentials
- Large routing or information architecture rewrites across multiple service areas
- Data model migrations beyond lightweight backend additions
