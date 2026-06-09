---
name: team-feature
description: Use when the user wants an end-to-end feature implementation workflow with planning, risk analysis, parallel work where explicitly allowed, review gates, and verification.
---

# Team Feature

Use this skill for feature work that benefits from explicit planning, task splitting, review discipline, and verification.

## Goal

Deliver the feature with enough structure that quality does not collapse as scope grows.

## Core rule

Codex may only spawn sub-agents when the user explicitly asks for delegation or parallel agent work.

If the user did not explicitly ask for that:
- run the workflow locally
- still keep the same phases
- simulate role-based review in the final output

## Workflow

### 1. Orientation

Start with a minimal scan:
- project layout
- relevant docs
- existing conventions
- current git status

### 2. Research only what is needed

Find:
- affected files and layers
- reference implementations already in the repo
- external docs only when necessary and allowed

### 3. Classify complexity

Use a lightweight classification:
- simple: narrow, low-risk, few files
- medium: several files/layers, behavior changes, notable edge cases
- complex: shared systems, auth/payments/data migration, or high blast radius

Scale the process accordingly.

### 4. Plan before editing

Define:
- tasks
- dependencies
- risks
- verification steps

For medium/complex work, write down a brief decision log in `DECISIONS.md` when useful.

### 5. Implement

Prefer small, reviewable edits.
When delegation is explicitly allowed, assign disjoint ownership to workers.

### 6. Review

Run a role-based self-review or delegated review against three lenses:
- security and data safety
- logic and edge cases
- quality and convention fit

### 7. Verify

Choose the smallest meaningful verification set:
- typecheck
- tests
- lint
- smoke test
- targeted manual checks

If something cannot be verified, call it out clearly.

## Completion format

Summarize:
- what changed
- risks found and mitigated
- verification completed
- remaining human checks
