# Brief

- date: 2026-03-14
- task: update the recurring SSUK improvement loop so non-network failures are analyzed and retried instead of being treated as immediate terminal failures
- requester: user

## Discovery
- The active automation already isolates network-dependent failures per subcycle.
- The current policy does not explicitly require retry behavior for non-network failures.
- The user wants non-network failures to trigger root-cause analysis and a bounded retry path.

## Scope
- Update the automation prompt.
- Update the local harness skill and repo policy docs.
- Keep the existing direct-push, stash/restore, and macro-improvement policies.

## Required Behavior
- If a failure is network-related, keep the current cycle-local failure handling.
- If a failure is not network-related, analyze the cause, attempt a safe correction if possible, and retry within the same subcycle.
- Retries must be bounded and must not loop indefinitely.

## Non-goals
- No product UI/code changes.
- No schedule change.
- No backend/API behavior change.
