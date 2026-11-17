# Test Results N: <task name> (REQ-nnn)

*Template — written by the Orchestrator **before** the Reviewer is dispatched (`TST-7-04`). It
records the run; the **verdict is the Reviewer's**, in `review_N.md` (`TST-9-03`). One file per
**defect cycle**; `N` increments on defect cycles only, not on authoring attempts (`TST-7-03`).
Rename to `test_results_<N>.md`. Delete the italic guidance.*

Task: `YYYY-MM-DD_task_name`. Orchestrator, YYYY-MM-DD.
Scenarios: *Test No(s) and script(s), with a note that each row was written in
`test_scenarios.md` before its script first ran (`TST-4-01`).*

## Declared Before the Run (`TST-5-02`)

*Every existing scenario whose assertion or expected value this task changes, with the reason —
written before the run that uses it. If none: "No existing scenario's assertion or expected
value changes for this task", plus the regression scripts checked to reach that conclusion.*

| Script | What changes | Reason |
|---|---|---|

## What the Run Writes (`TST-11a-04`)

*Data each script creates or changes through the application, and how it is undone
(`TST-11a-05`). "Writes nothing" is a valid entry.*

## Run

*Raw output folder (e.g. `run1_raw_output/`). One row per script: the exact command (`TST-9-09`),
the exit code, and the `RESULT:` line as printed. Facts only — no interpretation.*

| Script | Command | Exit | `RESULT:` line |
|---|---|---|---|

## Stabilisation (`TST-7-04`)

Stabilised after N attempts.
- Attempt 1: *what failed and what was changed (script mechanics — `TST-5-01`)*.
- Attempt 2: *…*
No assertions were changed. *(or: list each assertion change and its reason — `TST-5-02`)*

*If a script hit three attempts: the `log_system_defect.md` entry written for it (`TST-6a-07`,
`TST-6a-08`) and the requirement left unverified.*

## Environment Facts Discovered

*Added to `notes_for_agents.md` the same turn. "None" is valid.*
