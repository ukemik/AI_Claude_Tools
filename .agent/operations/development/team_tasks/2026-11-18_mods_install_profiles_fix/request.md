# Request: Fix the empty -Profiles call in Claude_Mods/install.ps1

Date: 2026-11-18
Task folder: `team_tasks/2026-11-18_mods_install_profiles_fix`
Requirements: REQ-001
Plan: **None** — checked against `WFL-4-02`: (1) no hard stop: no dependency, schema, database
function or constructor change; (2) no rule code added, retired or changed; (3) no role change;
(4) one file of application code changes (`Claude_Mods/install.ps1`), plus a new test script and
the task's records; (5) the Overseer did not ask for a plan.

## The Overseer's Request (verbatim)

> OK please fix that bug and let me know. I will restart everything for them to activate.

"That bug", as reported to the Overseer in the same session: when `Claude_Mods/install.ps1` is run
without `-VsCodeProfiles`, it passes an empty `-Profiles` to `build.ps1` through a child
`powershell -File`, which fails with *"Missing an argument for parameter 'Profiles'"*, so
prompt-pad's VS Code extension is not built or installed. The fix offered: only pass `-Profiles`
when profiles are given.

## Constraints and Decisions Already Made

- Existing tools are accepted as they are (`log_development_activity.md`, Standing decisions);
  this task fixes a defect the Overseer hit on 2026-11-18 while installing on a new computer.
- The Overseer runs every install; no agent runs `install.ps1` or `build.ps1` for real (`COD-1-01`).

## Out of Scope

- The old-computer paths (`C:\Users\ukemiktarak`, the OneDrive package path) in `CLAUDE.md`,
  `.claude/settings.json`, `notes_for_agents.md` and `Claude_Hooks/install.ps1`: offered to the
  Overseer as a separate task, not requested.
- `build.ps1` itself is unchanged.

## Known Hard Stops

None known. Installing the fix is the Overseer's step:
`! powershell -NoProfile -ExecutionPolicy Bypass -File Claude_Mods/prompt-pad/vscode-extension/build.ps1`
(or re-running `Claude_Mods/install.ps1`).

## Approach (when there is no plan)

Step 3 of `Claude_Mods/install.ps1` calls `build.ps1` in the same PowerShell process
(`& <build.ps1> -Profiles $VsCodeProfiles`) instead of through a child `powershell -File`, so an
empty array binds as an empty array, and a list of profiles binds as a list (the child process
would have split it across positional arguments). No version raise: the installer has no version
file, and neither mod nor the extension changes. Checked by the `.ps1` parse check and test 001,
which runs a copy of the installer against stub `claude`, `code` and `build.ps1` in
`.agent/temp/` so nothing outside the project is written. Environment variables: None (the test
prepends its stub folder to `PATH` for its own child process only).

## Requirement → Task Map

- [x] Row added to the map at the foot of `requirements.md` with status `ACTIVE` (`DOC-10-01`).
- [x] `task_status.md` updated.
