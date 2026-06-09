---
name: deep-thinking
description: Use when the user wants deep structured thinking before implementation, architecture planning, or a design document with trade-offs and an implementation plan.
---

# Deep Thinking

Use this skill when the user wants to think through a feature or refactor before coding.

## Goal

Turn a vague or complex idea into a compact design document with:
- a clear problem statement
- the main decision areas
- options and trade-offs for each area
- a recommended path
- an implementation plan
- success metrics

## Workflow

### 1. Break the task into decision areas

Start by restating the task in 1-2 sentences. Then identify the main aspects that need decisions.

Good aspect categories:
- product behavior
- UX flow
- data model
- API/contracts
- state management
- error handling
- observability
- rollout/migration
- testing
- security/privacy

Prefer 4-8 aspects. Avoid exceeding 12 unless the task is very broad.

### 2. Choose expert lenses

Assign an expert lens to each aspect. You do not need literal historical figures; concise roles are enough.

Good lenses:
- product thinker
- frontend architect
- backend architect
- database engineer
- security reviewer
- DX/maintainability reviewer
- performance engineer

For each aspect, provide:
- why it matters
- 2-4 viable options
- pros and cons
- recommendation

### 3. Study the actual project

Before final recommendations:
- inspect the repository structure
- find existing patterns
- identify touched layers
- reuse local conventions when they exist

Do not invent architecture that fights the codebase unless the user explicitly wants a redesign.

### 4. Use delegation only when allowed

If the user explicitly asks for sub-agents, delegation, or parallel expert work, you may split aspects across sub-agents.

If the user did not explicitly allow that:
- do the analysis yourself
- still present the output as multiple expert perspectives

### 5. Produce a design document

Default output structure:

```md
# <Task Name>

## Goal

## Context

## Decision Areas

### 1. <Aspect>
- Why it matters
- Options
- Recommendation

## Recommended Approach

## Implementation Plan
1. Phase 1
2. Phase 2
3. Phase 3

## Risks

## Success Metrics
```

When useful, save the document to `docs/plans/YYYY-MM-DD-<topic>-design.md`.

## Style rules

- Prefer concrete trade-offs over generic advice.
- Keep the recommendation compatible with the current codebase.
- Surface uncertainties explicitly.
- If coding will follow immediately, end with a crisp implementation sequence.
