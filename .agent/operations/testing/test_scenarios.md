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

**Next number to assign: 001.**

---

| Test No | Test Scenario | Req No | Test Script | Status | Status Date | Notes |
|---|---|---|---|---|---|---|

*Example row (delete):*
*`| 001 | Given <precondition>, when <action>, then <expected result, concretely>. | REQ-001 | test001_<title>.py | ACTIVE | YYYY-MM-DD | <run history, limits, what is not covered> |`*
