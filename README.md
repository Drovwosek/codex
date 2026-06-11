# Telegram Post Studio

Local-first MVP for restaurant marketers who prepare audience-specific Telegram posts.

## What it does

- stores restaurant and audience profiles in the browser;
- keeps separate audience portraits for every venue and validates that relationship during generation;
- researches a venue from its name using sourced OpenAI web search and saves only after review;
- accepts a topic and source materials;
- offers venue-specific post formats instead of arbitrary target lengths;
- generates a Russian Telegram post with OpenAI Responses API;
- keeps an optional image attached to the draft without sending it to AI;
- supports manual editing, copying, and draft history;
- works in demo mode when no API key is configured.

## Run

Python 3.9+ is the only runtime dependency.

```bash
cd /Users/kaban/codex/Projects/telegram-post-studio
export OPENAI_API_KEY="your-key"
python3 server.py
```

Open <http://127.0.0.1:8765>.

Optional configuration:

```bash
export OPENAI_MODEL="gpt-5.5"
export PORT="8765"
```

Without `OPENAI_API_KEY`, the app returns a clearly marked demo post so the full UI can still be tested.
Venue research requires `OPENAI_API_KEY` because it uses the Responses API `web_search` tool.

## Test

```bash
python3 -m unittest discover -s tests -v
```

## Structure

```text
postovaya/
  prompts.py          prompt construction and request validation
  openai_service.py   Responses API integration and response parsing
  http_app.py         HTTP routes and static file serving
web/
  js/store.js         local data, defaults, and migrations
  js/api.js           browser API client
  js/utils.js         shared browser utilities
  app.js              UI rendering and event coordination
```

`server.py` is a small compatibility entry point, so the run command remains unchanged.

## MVP boundaries

- one marketer on one browser;
- Telegram only;
- no direct Telegram publishing;
- no accounts or cloud database;
- no AI image generation;
- image attachments are kept only for the current browser session.
