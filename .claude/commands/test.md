---
description: Run every check for the current task before handover, save the raw output, and record test_results_N.md.
argument-hint: [task folder name]
---

Run the checks for: **$ARGUMENTS** (if blank, the in-flight task in `task_status.md`).

Acting as Orchestrator, follow `.agent/team/agent_orchestrator.md` §3 and
`.agent/rules/rules_testing.md` §9:

1. `N` = the next `test_results_N.md` number in the task folder.
2. Confirm every scenario and expected result is in `test_scenarios.md` before its first run
   (`TST-4-01`) and any changed expected value is declared (`TST-5-02`).
3. Compile-check, restart the application, run every check that applies; save the raw output in
   `run<N>_raw_output/`.
4. Write `test_results_N.md` — facts only; the verdict is the Reviewer's.
5. Update `task_status.md`, then go on to `/review` (or a step an adopted optional agent inserts).
