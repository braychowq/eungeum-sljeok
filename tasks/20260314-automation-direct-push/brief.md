# Brief

- date: 2026-03-14
- task: change the SSUK improvement loop to self-verify, auto-commit, and push directly without PR workflow
- requester: user

## Discovery
- The current automation `ssuk-2h-loop` is active as `SSUK Hourly Subcycle Loop`.
- The current prompt still commits and pushes to `origin codex/ssuk-improvement-loop`.
- The runtime skill and proposal files also still document dedicated-branch push behavior.
- The repo has existing dirty tracked product changes on `main`; this task must avoid touching those files.

## Scope
- Update the automation behavior so verified changes can be committed and pushed directly without PR steps.
- Align the local harness skill/docs with that behavior.
- Keep the existing hourly run with internal 20-minute subcycles.

## Non-goals
- No product UI/code changes.
- No cleanup of the existing dirty worktree.
- No schedule change.

## Assumption
- "PR 같은 절차는 필요없어" is interpreted as: after verification, the loop should commit and push directly to `origin/main` rather than to a separate review branch.

## Gates
1. Create `brief.md` and `delegation.yaml` before editing automation or harness files.
2. Only edit automation/harness/task files for this change.
3. Verify by checking updated automation config and matching harness docs.
