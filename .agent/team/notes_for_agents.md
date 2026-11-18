# Notes for Agents — AI_Claude_Tools

Environment facts that are true of this machine and this project, gathered so no agent has to
rediscover them. Read this before probing for anything below.

Last verified: 2026-11-17. If something here turns out to be wrong, correct it — a stale note is
worse than no note (`DOC-8-02`).

> **How this file is maintained.** Only the Orchestrator writes it (`DOC-1-01`). Every subagent
> ends its handoff with any environment fact it discovered; the Orchestrator writes the fact into
> the right section below in the same turn (`DOC-8-01`). Date each entry and say who found it,
> e.g. *(Reviewer, 2026-01-15)*. When a fact is superseded, replace it — do not stack "UPDATE:"
> paragraphs on top of an old one.
>
> **Keep section numbers stable.** Other documents cite §3 (git and diffs), §5 (shell) and §9
> (test credentials).

> **Rules that do not apply yet** *(Human Overseer, 2026-11-17)*. This project has no
> application server, no database and no conda environment. The rules about them (app URL and
> launch, `rules_testing.md` §10, every database rule — `COD-1-02` to `COD-1-05`, §6, §7,
> `COD-11.4`, `COD-20`, `TST-11`, `TST-11a` — and the conda rules `COD-18-04` to `COD-18-07`)
> stay in force but are **skipped until a task introduces an app, a database or a conda
> environment**. That task fills in the "not applicable yet" values (here and in the rules
> files) as part of its plan. Until then, neither the Orchestrator nor the Reviewer applies
> them or reports findings against them. Python-specific examples (type hints, docstrings,
> `logger`) are applied in spirit to PowerShell, TypeScript and JavaScript.

---

## 0. The Environment — Read This First

| | |
|---|---|
| What the project is | Source of the Overseer's Claude Code set-up: `Claude_Hooks/` (sound hooks, the project-checks hook) and `Claude_Mods/` (Claude Code mods `prompt-pad` and `usage-status`, and prompt-pad's VS Code extension), each with a PowerShell `install.ps1` |
| This computer *(Orchestrator, 2026-11-18)* | New computer: user profile `C:\Users\umut`, so the installs go to `C:\Users\umut\.claude`; project at `C:\Users\umut\Documents\umut\Github\AI_Claude_Tools`; `AI_Packages` at `C:\Users\umut\Documents\umut\Github\AI_Packages` (not OneDrive: pass `-PackageSource` to `Claude_Hooks/install.ps1`). The `C:\Users\ukemiktarak` and OneDrive paths elsewhere in this file and in `CLAUDE.md` are from the old computer |
| Runtimes | Windows PowerShell 5.1 (`powershell.exe`); Node `v24.18.0` and npm `11.16.0` on `PATH`; Claude Code CLI `claude` on `PATH` |
| Conda environment | Not applicable yet: this project has no conda environment (`COD-18-04`) |
| Environment file | Not applicable yet: no `environment.yml` (`COD-18-05`) |
| TypeScript | **Not installed** (no local `node_modules`, no global `tsc`). Mods' `tsconfig.json` extends `.claude-plugin/types/tsconfig.json`, which is generated at install time and git-ignored. `npx tsc` would download TypeScript into the npm cache outside the project — forbidden by `COD-1-01` |
| Test runner | `claude plugin test <mod folder>` for a mod's `hooks/*.test.ts`; `node --test <file>` for the VS Code extension's `*.test.js` |

## 1. Running the Application

Not applicable yet: this project has no application server. The "application" is a set of files
that `install.ps1` copies into `C:\Users\ukemiktarak\.claude` and VS Code.

| | |
|---|---|
| URL | Not applicable yet (no app) |
| Launch | Not applicable yet (no app) |
| **Installing a change** | **The Human Overseer runs it, never an agent** (`COD-1-01`: install scripts write outside the project). After a change, raise the version (the mod's `.claude-plugin/plugin.json`, the extension's `vscode-extension/package.json`, or `Claude_Hooks/project-checks/VERSION`), then ask the Overseer to run `! powershell -NoProfile -ExecutionPolicy Bypass -File Claude_Hooks/install.ps1` and/or `! powershell -NoProfile -ExecutionPolicy Bypass -File Claude_Mods/install.ps1` in the Claude prompt — **forward slashes**: `!` runs in Git Bash, which eats backslashes *(Orchestrator, 2026-11-18)*, and restart Claude Code / reload VS Code |

## 2. Database

Not applicable yet: this project has no database.

| Role | Reaches | Agents may use |
|---|---|---|
| **not applicable yet (no database)** | — | — |

## 3. Tooling

| Tool | Status |
|---|---|
| `git` | `git`, on `PATH` (`C:\Users\ukemiktarak\AppData\Local\Programs\Git\cmd\git.exe`). The repository root is the project folder. Remote `origin` = `git@github-personal:ukemik/AI_Claude_Tools.git` (SSH host alias `github-personal`) |
| Commits | **The Human Overseer commits by hand; agents never commit.** Before diffing for a review, check the last commit touching this project (`git log -1 -- .`). If the task began after it, `git diff HEAD -- .` is the task's diff; otherwise rebuild the baseline (see `agent_orchestrator.md` §4) |
| Review diff command | `git diff --ignore-cr-at-eol HEAD -- .` plus `git status --short -- .` for untracked files, whose contents are listed separately |
| `.agent/` in git | Tracked (only `.agent/temp/` contents are ignored, except its `README.md`) |
| Git-ignored | `*.vsix`, `*.bak`, `.claude-plugin/types/`, `.claude/prompts.txt`, `.claude/last-answer.txt`, `.agent/temp/*` |
| Database client | Not applicable yet (no database) |
| Browser automation | Not applicable yet (no UI) |

## 4. Related Projects

Readable, never writable. Added as additional directories in `.claude/settings.json`.

| Path | Use |
|---|---|
| `C:\Users\ukemiktarak\.claude` | The installed copies (hooks, mods, `ai_dev_package`, settings). Read to compare with the source or to check an install worked. **Never edited:** change the source here and have the Overseer reinstall |
| `../AI_Packages` | The ai_dev_package and ai_metrics_package sources, which some hooks here check for or call |

## 5. Shell

**The Reviewer has no shell.** Its `tools:` frontmatter is `Read, Grep, Glob`. The Orchestrator
(main session) has the shell and runs everything.

**Consequences, which the workflow absorbs:**

- The Orchestrator writes the code and the tests, runs the compile checks below and every test
  **before** handover, and saves the raw output in the task folder.
- The Reviewer reads and searches freely, reads the saved output itself, and gives the verdict
  (`rules_testing.md` §9). Anything else it needs run comes back as one batch (`WFL-3-07`).
- The Reviewer reports what it could not verify rather than pretending to have verified it.

**Do not assert in a dispatch brief that the Reviewer has a shell.** An agent told so trusts the
brief over its own tool list.

**Compile checks** (`PRJ-1.1-03`), one per changed file:

| File type | Command |
|---|---|
| `.js` | `node --check <file>` |
| `.ps1` | `powershell -NoProfile -Command "$e=$null; [void][System.Management.Automation.Language.Parser]::ParseFile('<file>',[ref]$null,[ref]$e); if ($e) { $e; exit 1 }"` |
| `.ts` (mods) | `claude plugin test <mod folder>` (no standalone TypeScript checker installed, §0) |
| `.json` | `Get-Content <file> -Raw \| ConvertFrom-Json \| Out-Null` |

**Shell quirks (Windows PowerShell 5.1):** `&&` and `||` are parser errors (chain with `;` or
`if ($?) { }`); no `head`, `tail`, `which`, `touch`; `Set-Content` defaults to the ANSI code page
— use the `Write` / `Edit` tools for text files, or write with an explicit UTF-8 encoding. The
project lives under OneDrive: paths contain spaces (`OneDrive - Cabaletta Bio`), so quote them.

## 6. Open Items That Shape Work

| Ref | Item |
|---|---|
| — | Several files must stay in step by hand (prompt-pad `README.txt`): `CLEAR_MARKER` in `hooks/register.ts` and `vscode-extension/extension.js`; `withOpenBlock` in `hooks/register.ts` and `vscode-extension/block.js` |

## 7. Accepted Behaviours — Not Defects

Things that look wrong and are not. Do not report these as `FAIL_DEFECT` or as review findings.

| Behaviour | Why it is accepted |
|---|---|
| A change does not show in Claude Code or VS Code | Nothing is live until the Overseer runs `install.ps1` and restarts Claude Code / reloads VS Code (§1) |
| Ctrl+Enter in `prompts.txt` only inserts a new line | The VS Code window's extensions did not start after an extension-host restart; *Developer: Reload Window* fixes it *(Human Overseer, 2026-11-17)* |

## 8. Browser Automation

Not applicable yet: this project has no web UI.

## 9. Test Account Credentials

None: the project has no accounts. If one is ever needed, the variables use the prefix `AICT_`
(e.g. `AICT_TEST_PW_ADMIN`). **The values are never written in the repo, in a brief, or in a
command.**

**Rules:**
- **Never put a password in a command.** Rely on the inherited variables.
- **Check presence, never the value.** Do not print or log the value.
- **If a variable is missing, ask the Human Overseer to set it. Do not ask for the password
  itself.** A newly set user variable needs a session restart before it is visible.
- Test scripts reference a credential by key through a helper (catalogued in
  `test_functions.md`); the Orchestrator runs them. The Reviewer never sees the variables.

## 10. Lessons Learned

*(none yet)*
