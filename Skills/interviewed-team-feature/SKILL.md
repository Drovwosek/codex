---
name: interviewed-team-feature
description: Use when the user wants to discuss a feature before implementation, wants you to ask a few targeted questions first, or explicitly asks for an interview-driven build workflow.
---

# Interviewed Team Feature

Use this skill when user intent is unclear and a short interview will materially improve the build.

## Principle

Ask only for information the codebase cannot reveal.

Do not ask about:
- tech stack
- architecture
- testing approach
- affected files
- implementation details you can discover yourself

Do ask about:
- what should change
- who it is for
- how success will be recognized
- what is out of scope

## Workflow

### 1. Quick codebase scan

Before asking questions, inspect enough of the project to avoid generic questions.

### 2. Ask 2-6 targeted questions

Prefer concise, concrete questions. Good sequence:
1. What should change when this works, and for whom?
2. Who uses this most?
3. What is the clearest sign of success?
4. Anything that should explicitly stay out of scope?

Ask fewer questions if the initial request is already detailed.

### 3. Compile a feature brief

Default structure:

```md
# Feature Brief

## Intent
## Audience
## Success Criteria
## Exclusions
## Project Context
## Open Questions
```

### 4. Hand off to implementation

Once the brief is good enough, continue using the `team-feature` workflow.

## Style rules

- One question at a time unless the user prefers batching.
- Keep the interview short.
- Translate vague answers into concrete success criteria before coding.
