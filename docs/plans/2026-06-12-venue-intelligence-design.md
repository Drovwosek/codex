# Venue Intelligence

## Goal

Turn a venue name into a reviewable, sourced brand profile and use that profile to offer meaningful post formats instead of arbitrary text lengths.

## Context

The application is local-first. Profiles and drafts live in browser storage, while OpenAI requests pass through the Python server.

## Decision Areas

### Research workflow

Use Responses API web search and require a venue name plus an optional location or URL hint. Never save findings before user confirmation.

### Data trust

Store confirmed facts, uncertainties, source links, positioning, voice, content pillars, and recommended post styles separately. AI interpretation must not look like a verified fact.

### Post formats

Replace text length with venue-specific formats. Use generic formats only for profiles that have not been researched.

### Persistence

Keep the profile in local storage for this release. Cloud sync and revision history remain future work.

## Implementation Plan

1. Add a sourced venue-research endpoint.
2. Add research review and confirmation UI.
3. Extend venue profiles and generation prompts.
4. Add venue-specific post formats.
5. Cover parsing and validation with tests.

## Risks

- A venue name can be ambiguous; the UI asks for a location or URL hint.
- Public data can be stale; sources and uncertainties remain visible.
- Research can be slow or costly; it runs only on explicit request.

## Success Metrics

- A marketer can create a usable venue profile without manually writing its description.
- Every researched profile displays sources and uncertainty before saving.
- Post generation no longer asks for target length.
