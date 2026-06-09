---
name: conventions
description: Use when the user wants to analyze a codebase and create or update a .conventions directory with gold standards, anti-patterns, and lightweight checks.
---

# Conventions

Use this skill to extract project taste into reusable files.

## Goal

Create or update `.conventions/` so future implementation can match the repository's established patterns.

## Target structure

```text
.conventions/
  gold-standards/
  anti-patterns/
  checks/
```

## Workflow

### 1. Inspect the codebase

Identify:
- stack and framework
- directory layout
- common component and API patterns
- naming conventions
- import conventions
- test style

### 2. Build gold standards

Create short, reusable examples from real files in the project.

Rules:
- 20-30 lines when possible
- one pattern per file
- include a short header comment explaining the pattern
- prefer representative structure over app-specific details

### 3. Build anti-patterns

Capture repository-specific mistakes or drift:
- bad imports
- inconsistent naming
- inline styles where wrappers are expected
- direct calls into forbidden layers

Use a simple BAD -> GOOD format.

### 4. Build checks

Add lightweight guidance files such as:
- `naming.md`
- `imports.md`
- `testing.md`

Prefer concrete examples and regex-like rules where useful.

### 5. Update safely

If `.conventions/` already exists:
- read it first
- update stale guidance
- add missing patterns
- do not delete user-authored material without explicit request

## Output

Report what was created or updated and where the codebase still lacks a clear standard.
