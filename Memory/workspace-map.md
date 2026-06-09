# Codex workspace map

`E:\Codex` is the shared workspace root. It contains active projects, shared notes, helper scripts, and reference material.

## Main areas

- `Memory` - shared notes and durable context for Codex work. Open this folder as an Obsidian vault.
- `Scripts` - small launch helpers for working with this workspace from PowerShell or cmd.
- `Repo` - active product and code projects.
- `Repo/LMS` - main LMS app, Next.js + Prisma/Postgres. Separate git repository.
- `Repo/lms-ai-landing` - static HTML/CSS/JS landing page. Tracked by the root repository.
- `Repo/jtbd-interview-transformer` - React + TypeScript + Vite app. Separate git repository.
- `Repo/figma-mcp-react-demo` - React + TypeScript + Vite demo project. Separate git repository.
- `methodology` - shared definitions, questions, and working methodology notes.
- `Skills` - locally adapted Codex workflow and skill materials.

## Helper commands

Run these from a terminal when `E:\Codex\Scripts` is on PATH, or call the files directly.

- `cw` - open `E:\Codex\codex.code-workspace` in VS Code.
- `cprojects` - list known project folders under `E:\Codex\Repo`.
- `cdx <project-name>` - start Codex inside a project. Defaults to `LMS`.
- `obsnotes` - open `Memory` as an Obsidian vault.

PowerShell equivalents:

```powershell
E:\Codex\Scripts\open-workspace.ps1
E:\Codex\Scripts\list-projects.ps1
E:\Codex\Scripts\codex-in.ps1 LMS
E:\Codex\Scripts\open-obsidian-vault.ps1
```

## Suggested mental model

- Work on product code inside the project folders.
- Keep durable decisions, plans, and handoff notes in `Memory`.
- Treat `Scripts` as workspace utilities, not product code.
- Treat `Skills` as reference material unless you are explicitly editing it.
