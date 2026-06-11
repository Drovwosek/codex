# Feature Brief

## Intent

Help an independent marketer create a complete Telegram post for one restaurant location and one known audience segment from a topic and marketer-provided materials.

## Audience

An independent marketer who manages several locations in a restaurant chain.

## Success Criteria

- The marketer selects a restaurant and audience segment.
- Each audience segment belongs to one restaurant location; selecting a restaurant limits the available segments to that location.
- The marketer provides a topic and optional source materials.
- The app produces a ready-to-edit Russian Telegram post tailored to that context.
- The marketer can edit, copy, and save the result as a draft.

## Exclusions

- Automatic audience discovery or improvement suggestions.
- Direct publication to Telegram.
- Multiple social networks.
- Generated images.
- Team collaboration, approvals, and analytics.

## Project Context

This is a new local-first web MVP. Restaurant profiles, audience segments, and drafts are stored in browser local storage. AI requests pass through a small server so the API key is never exposed to the browser.

## Open Questions

- Which post performance signals should later feed back into generation?
- Should a future version support brand-level rules shared across locations?
