---
name: vibe-audit
description: Use when the user wants to audit a project for dead code, abandoned experiments, orphan UI, stale features, or cleanup candidates through an interactive review.
---

# Vibe Audit

Use this skill to find suspicious code and review it with the user before deleting anything.

## Principle

Static reachability is not enough. A feature can still be wired up and still be obsolete.

## Workflow

### 1. Pick scope

Possible scopes:
- full codebase
- features/modules
- server/API
- UI/design system
- stores/state

If the user gives no scope, start broad and then zoom in.

### 2. Discover suspicious items

Look for signals such as:
- files or directories with almost no imports
- routes or handlers with no callers
- components with no real entry points
- duplicate flows after a refactor
- stale feature flags
- old onboarding/experiments left behind
- store slices with no selectors or actions used
- code that is referenced only by tests or storybook

### 3. Present candidates one by one or in a compact batch

For each candidate include:
- what it is
- why it looks suspicious
- key files
- known references
- likely impact if removed

Ask the user to classify it as:
- delete
- keep
- deprecated
- investigate further

### 4. Never delete without confirmation

Deletion requires explicit user confirmation.

Before destructive cleanup:
- inspect git status
- avoid reverting unrelated changes
- prefer a focused patch
- run the smallest useful verification step afterward

### 5. Produce an audit report

Summarize:
- delete candidates approved by the user
- items to keep
- items to deprecate
- unresolved items needing more investigation

## Optional automation

When the user asks to actually remove approved dead code:
- create a narrow cleanup patch
- verify with targeted tests, lint, or typecheck when available
- report any remaining manual checks

## Style rules

- Be skeptical but not trigger-happy.
- Explain why something looks stale.
- Treat the user's product context as the source of truth.
