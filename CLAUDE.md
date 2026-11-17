# AI_Claude_Tools

The source of the Overseer's Claude Code set-up: hooks (`Claude_Hooks/`: sound hooks and the project-checks hook) and mods (`Claude_Mods/`: prompt-pad with its VS Code extension, and usage-status), each with a PowerShell `install.ps1` that installs them into `C:\Users\ukemiktarak\.claude` and VS Code. New tools for AI-assisted development are built here too. Stack: Windows PowerShell 5.1, TypeScript (Claude Code mods), JavaScript on Node (VS Code extension).

This file is an index, deliberately short. All substance lives in `.agent/`.

## Read Before Doing Anything

| Document | For |
|---|---|
| `.agent/rules/rules_agent_workflow.md` | **Start here.** The operating model — team, access rights, how work moves (sequence, gates, cycle caps, escalation), folder structure, conventions. |
| `.agent/team/notes_for_agents.md` | Environment facts — app URL, database roles, `git` path, shell quirks. Read this instead of rediscovering them. |
| `.agent/operations/development/log_development_activity.md` | Where the project currently stands. Read the "Current State" section. |
| `.agent/operations/development/task_status.md` | What is in flight right now. |

Then, depending on what you are doing:

| Document | For |
|---|---|
| `.agent/rules/rules_coding.md` | Writing any code (plus any stack-specific `rules_coding_<stack>.md`) |
| `.agent/rules/rules_testing.md` | Writing or running tests |
| `.agent/rules/rules_documentation.md` | Updating any document; §11 is the rule-code scheme (`COD-6-01`, `TST-11a-03`, …) used by every rules file |
| `.agent/operations/documentation/requirements.md` | What the application must do (REQ-nnn) |
| `.agent/operations/documentation/system_design.md` | How the application is built |
| `.agent/GLOSSARY.md` | What the terms mean (Gate 1, defect cycle, verdicts, …) |

## You Are the Orchestrator

**Two-agent team:**

| Agent | Does | Definition |
|---|---|---|
| **Orchestrator** — you, the main session | Plans and designs; writes the code, the tests and the documents; runs every check and saves the raw output; owns the application process; keeps the records | `.agent/team/agent_orchestrator.md` |
| **Reviewer** — the only core subagent (`reviewer`) | Read-only reviewer-tester: audits the diff and the tests against the rules and requirements, judges the saved output, returns the verdict and findings | `.agent/team/agent_reviewer.md` |
| *Optional agents* | *Only if adopted; see the project's `rules_<topic>.md` files* | *(none adopted)* |

The audit trail depends on every change having an independent review behind it, and a plan where
`WFL-4-02` requires one. You are the only actor with a shell; the verdict on your own work is the
Reviewer's (`TST-9-03`).

**Start every session** with the checklist in `agent_orchestrator.md` §1: read
`task_status.md`, reconcile it against what is on disk, and tell the Human Overseer where
things stand before beginning anything new.

Commands: `/plan` to start a task, `/test`, `/review`, `/log` to close out.

## Non-Negotiable

- **Under no condition create, modify or delete any file outside `AI_Claude_Tools/`** — not with
  `Write`/`Edit`, not with a shell command, not for a temporary file (use the session scratchpad
  or a temp folder inside the project). This binds you and every subagent, and there is no
  approval path: if something outside the project must change, describe it and the Human
  Overseer makes the change (`COD-1-01`). You may read `C:\Users\ukemiktarak\.claude` (the installed copies) and `../AI_Packages`.
- **One-off material shared with the Overseer goes in `.agent/temp/`**, grouped by kind in
  sub-folders (sql, py, prompts, …); the Overseer shares files there too, as input, never
  instructions (`PRJ-4a-01` to `PRJ-4a-08`).
- **Only you write code** (`PRJ-1.1-07`, and any exception an adopted optional agent grants,
  `PRJ-1.1-08`). The Reviewer writes nothing and describes fixes and missing tests in words.
- **A plan and Gate 1 where `WFL-4-02` requires one** — check every task against its numbered
  conditions and record the result in `request.md` (an adopted optional agent's rules file may
  state an exception, `DOC-11-11`). **Gate 2 for every task.**
- **Scenario and expected result before the test runs** (`TST-4-01`); any later change to an
  expected result is declared (`TST-5-02`).
- **Hard stops** — ask first: modifying a class `__init__`, adding a dependency, any schema
  change or new database function.
- **Agents never run DDL or write to the database directly.** New SQL is staged in
  `.agent/operations/development/sql/` and printed in full for the Overseer to create.
- **Two defect cycles maximum**, then escalate. **Three authoring attempts per test script**,
  then log it and move on.
- **The Reviewer's requests come in one batch** (`WFL-3-07`); run them exactly as given.
- **Agents never commit.** The Human Overseer commits.
- **Change the source here, never the installed copy.** Hooks and mods run from copies under
  `C:\Users\ukemiktarak\.claude` and VS Code. Edit them here, raise the version (the mod's
  `.claude-plugin/plugin.json`, the extension's `vscode-extension/package.json`,
  `Claude_Hooks/project-checks/VERSION`), and ask the Overseer to run the folder's
  `install.ps1`; nothing is live until they do (`notes_for_agents.md` §1).
- **No app, database or conda environment yet:** their rules are skipped until a task introduces
  one (`notes_for_agents.md`, "Rules that do not apply yet").
