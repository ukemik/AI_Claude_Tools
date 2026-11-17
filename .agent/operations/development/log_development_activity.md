# Development Activity Log — AI_Claude_Tools

Two sections with opposite rules. **Current State** is rewritten every time. **Changelog** is
append-only, newest first, and entries older than 7 days move to
`log_development_activity_archive.md`. See `../../rules/rules_documentation.md` §3 and §4.

---

## Current State

*Rewritten at every task close. If this is stale, the 7-day archive rule has destroyed the
project's memory — see `rules_documentation.md` §4.*

*Last rewritten YYYY-MM-DD, at the close of `<task folder>` (REQ-nnn).*

**What the application is.** *One paragraph: purpose, stack (Windows PowerShell 5.1, TypeScript (Claude Code mods), JavaScript on Node (VS Code extension)), where it runs
(not applicable yet (no app)).*

**What is built.** *The features and screens that are done, by area.*

**What is in progress.** *Pointer to `task_status.md`; one line per task in flight.*

**What comes next.** *Pointer to Next Up in `task_status.md`; the next one or two items.*

**Known limitations and open defects.** *The few that shape upcoming work; full list in
`log_system_defect.md`.*

**Standing decisions.** *Overseer decisions every agent must know (with dates), or pointers to
where they are recorded.*

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
