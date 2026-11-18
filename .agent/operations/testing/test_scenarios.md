# Test Scenarios — AI_Claude_Tools

One cumulative table for the whole project, not one per task. Maintained by the Orchestrator
(`TST-8-01`).

**The scenario and its expected result are written here before the script is first run.** This
is what makes it possible to tell later whether a passing test was earned or whether its
assertion was quietly weakened. See `../../rules/rules_testing.md` §4.

**Changing an expected value later** (for example because a new task changes the behaviour) is
declared at the top of the scenario text — date, task, reason, rule `TST-5-02` — and in that
task's `test_results_N.md`, before the run that uses it. The old expectation is never silently
overwritten.

Test numbers are sequential and permanent — never reused, never renumbered.
Status is `ACTIVE`, `DONE`, or `CANCELED`.

**Next number to assign: 002.**

---

| Test No | Test Scenario | Req No | Test Script | Status | Status Date | Notes |
|---|---|---|---|---|---|---|
| 001 | Given a copy of `Claude_Mods/install.ps1` in a sandbox under `.agent/temp/test001/`, with stub `claude.cmd` and `code.cmd` first on `PATH` (the stub `claude` reports the marketplace and both mods as already present) and a stub `prompt-pad/vscode-extension/build.ps1` that records the `-Profiles` it receives: **(A)** when the installer is run as `powershell -File <install.ps1>` with no `-VsCodeProfiles`, then it exits 0, its output does not contain "Missing an argument", and the stub `build.ps1` is called exactly once with 0 profiles; **(B)** when run as `& <install.ps1> -VsCodeProfiles p1,p2`, then it exits 0 and the stub is called exactly once with the 2 profiles `p1`, `p2` in that order. Prints `RESULT: PASS` only if both hold, else `RESULT: FAIL` with the failing check. Writes nothing outside `.agent/temp/test001/`, which it recreates on each run. Run with `-Installer` pointing at the pre-fix copy (from `git show HEAD:Claude_Mods/install.ps1`), case A is expected to fail. | REQ-001 | `test001_mods_install_profiles.ps1` | ACTIVE | 2026-11-18 | PowerShell, not Python: the project has no Python environment (`notes_for_agents.md`, rules applied in spirit); kept in `testing/py/` per `TST-2-01`. Does not exercise the real `build.ps1` or `code --install-extension` (they write outside the project, `COD-1-01`). |
