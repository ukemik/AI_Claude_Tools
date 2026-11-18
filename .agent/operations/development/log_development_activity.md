# Development Activity Log — AI_Claude_Tools

Two sections with opposite rules. **Current State** is rewritten every time. **Changelog** is
append-only, newest first, and entries older than 7 days move to
`log_development_activity_archive.md`. See `../../rules/rules_documentation.md` §3 and §4.

---

## Current State

*Rewritten at every task close. If this is stale, the 7-day archive rule has destroyed the
project's memory — see `rules_documentation.md` §4.*

*Last rewritten 2026-11-17, at package adoption (no task yet).*

**What the application is.** The source of the Overseer's Claude Code set-up (see
`system_design.md` §1). Stack: Windows PowerShell 5.1, TypeScript (Claude Code mods), JavaScript
on Node (VS Code extension). Nothing runs from this folder: each folder's `install.ps1`, run by
the Overseer, copies it into `C:\Users\ukemiktarak\.claude` and VS Code.

**What is built.** All of it is finished and accepted as it stands *(Human Overseer,
2026-11-17)*:
- `Claude_Hooks/`: sound hooks; the project-checks session-start hook (checks
  `ai-dev-package`, `installed-copies`).
- `Claude_Mods/prompt-pad/`: `/p`, `last-answer.txt`, the clear marker, and the VS Code extension
  Prompt Pad Sender 0.7.0 (Ctrl+Enter, Ctrl+Shift+Enter, `@` and `~` completion).
- `Claude_Mods/usage-status/` 0.4.0: context and rate-limit usage beside the prompt.

**What is in progress.** Nothing (`task_status.md`).

**What comes next.** Nothing scheduled. The first session writes the opening sections of
`requirements.md` (see `task_status.md`, RESUME HERE).

**Known limitations and open defects.** None open (`log_system_defect.md` is empty).

**Standing decisions.**
- *(Human Overseer, 2026-11-17)* **No outstanding work.** Every existing tool is in the form the
  Overseer needs; none needs an update. Do not propose changes, refactors or fixes to existing
  tools unless the Overseer asks.
- *(Human Overseer, 2026-11-17)* App, database and conda rules are kept but skipped until a task
  introduces one (`notes_for_agents.md`, "Rules that do not apply yet").
- *(Human Overseer, 2026-11-17)* The Overseer runs every `install.ps1`; agents never do
  (`COD-1-01`).
- *(Human Overseer, 2026-11-17)* No TypeScript compiler is installed. Claude Code runs the mods'
  `.ts` files itself, and `claude plugin test` is their check (`notes_for_agents.md` §5). Adding
  TypeScript would be a dependency hard stop; not wanted now.

**To do / reminders.**
- [ ] **Database first (`COD-20-01`)** — not applicable yet: the project has no database. If a
  task introduces one, it fills in the database values (schema prefix, database name, roles file)
  and the database objects come first, placed in their functional schemas (`COD-20-02`), with
  the database-creation script (`COD-20-06`) and the git-ignored roles file (`COD-20-07`).

---

## Development Log & Changelog

*Append-only. Newest entry at the top. Format per `DOC-3-02`:*

```
[YYYY-MM-DD]
[Task]: team_tasks/YYYY-MM-DD_task_name
[Requirements]: REQ-nnn, REQ-nnn
[Action Taken]: Brief summary of the change.
[Reasoning/Purpose]: Why it was done, technically.
[Current State]: Status of the feature after this change.
```

[2026-11-17]
[Task]: (none — project setup)
[Requirements]: (none)
[Action Taken]: Adopted the AI agent development team package: `.agent/` structure, rules, role definitions, `.claude/` agents and commands, `CLAUDE.md`.
[Reasoning/Purpose]: Establish the operating model before the first task.
[Current State]: Ready for the first task.
