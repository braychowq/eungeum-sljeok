# Brief

## Request
- Update the recurring SSUK improvement automation so each cycle works directly on `main` instead of creating a temporary cycle branch.
- Add a cleanup rule so, when an automation run finishes and nothing actionable remains for the user, the run archives its thread/inbox item.
- Keep the existing macro-improvement preference and failure isolation behavior.
- If a failure is not caused by network issues, analyze the cause and retry once before ending the subcycle.

## Constraints
- Preserve the current local worktree state and do not rely on unresolved local edits as the source of truth.
- Avoid destructive git commands.
- Keep automation behavior safe for repeated unattended runs.

## Deliverables
- Updated automation policy/config.
- Updated harness/skill guidance aligned with the new direct-to-main workflow and safe thread cleanup rule.
- Result summary documenting risks and follow-up notes.

## Verification
- Confirm automation config and harness docs are consistent with each other.
- Explain the operational tradeoff of working directly on `main` without temporary cycle branches.
