# Brief

## Request
- Continue to the next macro improvement after the validated community cycle.
- Work directly on local `main` and complete the full manual cycle: implement, verify, commit, push, and restore the pre-cycle local state.

## Selected Scope
- `/market` browse-vs-host refinement, focused on stronger compare-and-contact scaffolding.
- Make the market page clearer about which studios should be contacted first and why, before the full browse rail.

## Constraints
- Frontend-only, low-risk page-level improvement.
- Keep routing, backend, data contracts, and persistence unchanged.
- Preserve and restore the pre-cycle dirty workspace after completion.

## Verification
- `cd frontend && npm run build`
- `git diff --check`
- direct commit/push from local `main`
