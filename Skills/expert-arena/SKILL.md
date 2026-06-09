---
name: expert-arena
description: Use when the user wants multiple expert viewpoints, a debate between options, or a decision map rather than a single answer.
---

# Expert Arena

Use this skill for questions with real trade-offs and multiple viable paths.

## Goal

Build a decision map, not a fake consensus. Preserve disagreement when it is informative.

## Workflow

### 1. Frame the decision

Identify:
- the question
- the stakes
- the constraints
- the candidate options

If the options are not explicit, derive 3-5 concrete options before evaluating.

### 2. Select expert viewpoints

Pick 3-5 distinct lenses with meaningful disagreement. Include one contrarian or devil's-advocate viewpoint when appropriate.

Examples:
- staff frontend engineer
- platform engineer
- product manager
- security engineer
- cost/operations owner
- growth/monetization lead

### 3. Evaluate independently first

For each expert, evaluate every option independently:
- strengths
- weaknesses
- failure modes
- best-fit contexts
- rough rating from 1-5

Do not collapse the opinions too early.

### 4. Cross-enrich

After the first pass, compare the evaluations and add:
- arguments experts missed
- where they actually agree
- where disagreement comes from

### 5. Filter weak options carefully

Eliminate an option only when it is clearly dominated or fails the stated constraints.
Keep niche options if they win in a specific context.

### 6. Synthesize

Default output structure:

```md
# <Decision>

## Context

## Options

## Expert Evaluations

## Surviving Options

## Decision Navigator
| If your context is... | Choose... | Why |

## Eliminated Options

## Recommended Default
```

## Delegation rule

If the user explicitly asks for multi-agent work, you may delegate expert roles to sub-agents.
Otherwise perform the full arena locally and label the sections by expert lens.

## Style rules

- Use real trade-offs, not generic pros/cons.
- Prefer context-dependent guidance over one-size-fits-all verdicts.
- Keep minority viewpoints when they contain signal.
