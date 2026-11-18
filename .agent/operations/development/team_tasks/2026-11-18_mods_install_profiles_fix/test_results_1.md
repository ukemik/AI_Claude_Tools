# Test Results 1: Fix the empty -Profiles call in Claude_Mods/install.ps1 (REQ-001)

Task: `2026-11-18_mods_install_profiles_fix`. Orchestrator, 2026-11-18.
Scenarios: Test 001, `.agent/operations/testing/py/test001_mods_install_profiles.ps1`. The row
was written in `test_scenarios.md` before the script first ran (`TST-4-01`).

## Declared Before the Run (`TST-5-02`)

No existing scenario's assertion or expected value changes for this task: test 001 is the
project's first scenario; there are no regression scripts.

| Script | What changes | Reason |
|---|---|---|

## What the Run Writes (`TST-11a-04`)

Only `.agent/temp/test001/` (sandbox copy of the installer, stub `claude.cmd`, `code.cmd`,
`build.ps1`, and `build_calls.txt`), recreated on each run; `.agent/temp/` is git-ignored. The
pre-fix run also uses `.agent/temp/prefix/install.ps1` (from `git show HEAD:Claude_Mods/install.ps1`).
The installer's step 4 reads `C:\Users\umut\.claude\settings.json` (read only). `PATH` is changed
only inside the test's own process.

## Run

Raw output folder: `run1_raw_output/` (`compile_check.txt`, `test001_fixed.txt`,
`test001_prefix.txt`).

| Script | Command | Exit | `RESULT:` line |
|---|---|---|---|
| Parse check (both `.ps1`) | `[System.Management.Automation.Language.Parser]::ParseFile(...)` on `C:\Users\umut\Documents\umut\Github\AI_Claude_Tools\Claude_Mods\install.ps1` and `C:\Users\umut\Documents\umut\Github\AI_Claude_Tools\.agent\operations\testing\py\test001_mods_install_profiles.ps1` | — | parse OK, parse OK |
| test001 (fixed installer) | `powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\umut\Documents\umut\Github\AI_Claude_Tools\.agent\operations\testing\py\test001_mods_install_profiles.ps1"` | 0 | `RESULT: PASS` |
| test001 (pre-fix installer, control) | `powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\umut\Documents\umut\Github\AI_Claude_Tools\.agent\operations\testing\py\test001_mods_install_profiles.ps1" -Installer "C:\Users\umut\Documents\umut\Github\AI_Claude_Tools\.agent\temp\prefix\install.ps1"` | 1 | `RESULT: FAIL` (expected: case A fails; case B also fails, build.ps1 received only `p1`) |

## Stabilisation (`TST-7-04`)

Stabilised after 1 attempt. No assertions were changed.

## Environment Facts Discovered

- `!` commands typed at the Claude prompt run in Git Bash: backslashes in a path are eaten
  (`Claude_Hooks\install.ps1` became `Claude_Hooksinstall.ps1`); give the Overseer forward-slash
  paths. Added to `notes_for_agents.md` §1 and §5.
- This computer: user profile `C:\Users\umut`, project at
  `C:\Users\umut\Documents\umut\Github\AI_Claude_Tools`, `AI_Packages` at
  `C:\Users\umut\Documents\umut\Github\AI_Packages`. Recorded in `notes_for_agents.md` §0.
