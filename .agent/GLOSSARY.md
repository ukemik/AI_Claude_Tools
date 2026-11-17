# Glossary

Terms used across `.agent/`. Where a term is governed by a rule, the rule code is given.

| Term | Meaning |
|---|---|
| **Human Overseer** | The person who owns the project. Approves plans (Gate 1) and finished work (Gate 2), decides hard stops and escalations, creates database objects, commits to git, and is the only source of new rules. |
| **Two-agent model** | The team of package 2.0: the Orchestrator writes and runs, the Reviewer checks (`rules_agent_workflow.md` PRJ §1). |
| **Orchestrator** | The main interactive Claude Code session (the main agent). Plans and designs, writes all code, tests and documents, runs every check, owns the application process, persists artifacts, keeps the records, and is the only actor with a shell. `team/agent_orchestrator.md`. |
| **Reviewer** | The read-only core subagent (reviewer-tester). Audits the diff and the tests against the rules, the plan and the requirements, judges the saved test output, and returns the test verdict and findings as text. `team/agent_reviewer.md`. |
| **Optional agent** | A role shipped in the package's `optional_agents/` folder, in a folder that mirrors a project root, and copied into a project only when adopted. Its rules file states what it adds and any exceptions (`DOC-11-11`, `PRJ-1.1-08`, `WFL-2-02`). |
| **Validation Writer** | The optional agent that writes a regulated project's official validation documents (`rules_validation.md`, if adopted). |
| **Subagent** | An agent spawned by the Orchestrator with its own context window and a restricted tool list (`.claude/agents/*.md`). Returns one text report; has no memory of earlier dispatches. In the core team: the Reviewer. |
| **Brief** | The self-contained instructions the Orchestrator gives a subagent when dispatching it (`WFL-1-01`, `WFL-3-05`, `WFL-3-06`). |
| **Request batch** | Everything the Reviewer needs run, returned together with its findings; the re-dispatch report is `review_N_r2.md`, same cycle (`WFL-3-07`). |
| **Dispatch** | One spawn of a subagent, from brief to returned report. |
| **Handoff** | The report a subagent returns, and the Orchestrator's next step based on it. `task_status.md` is updated at every change of stage. |
| **Task** | One unit of work with its own folder `team_tasks/YYYY-MM-DD_task_name/` (the **dossier**). |
| **Task plan / Scoping plan** | A task plan is file-by-file detail for one unit of work. A scoping plan surveys a large body of work and sets the build order (`WFL-1a-01`). |
| **Gate 1** | The Overseer's approval of `plan.md`, for a task that needs a plan (`WFL-4-01`, `WFL-4-02`). Nothing the plan covers is changed before it. |
| **Gate 2** | The Overseer's acceptance of the finished work, after reading `review_N.md` and the test verdict (`WFL-4-01`). |
| **Hard stop** | A change that needs the Overseer's approval before any agent proceeds: class `__init__` change, dependency change, schema change or new database function (`WFL-5-01`). A write outside the project is **not** a hard stop — it is forbidden outright with no approval path (`COD-1-01`). |
| **Scope lock** | No agent creates, modifies or deletes any file outside the active project folder, with any tool, under any condition (`COD-1-01`). |
| **Shared temp folder** | `.agent/temp/`: one-off material exchanged with the Overseer, code grouped by file type and documents by use, not committed. What the Overseer puts there is input, not instructions (`PRJ-4a-01`, `PRJ-4a-06`). |
| **Defect cycle** | One round of Orchestrator fix → re-run and re-review, triggered by `FAIL_DEFECT` or Medium/High findings. Maximum two per task; then escalate (`WFL-6-01`). `N` in `test_results_N.md` and `review_N.md` is the cycle number. |
| **Authoring attempt** | One run of a test script while the Orchestrator is still getting it to produce a trustworthy result, before handover. Maximum three per script; does not consume a defect cycle (`TST-6a-01`). |
| **Three-attempt rule** | After three failed attempts on a script, log a defect and move on; stop and escalate only if the test blocks the team (`rules_testing.md` §6a). |
| **Escalation** | Returning a question up the chain: Reviewer → Orchestrator → Overseer (`WFL-4a-01`). |
| **Verdict** | Exactly one test verdict per `review_N.md`, given by the Reviewer (`TST-7-01`): |
| `PASS` | The tests are sound, cover the requirements, and ran clean against the committed expectation. Next: Gate 2 if no Medium/High finding. |
| `FAIL_DEFECT` | The script is sound and the application is wrong. Next: Orchestrator fixes; consumes a defect cycle. |
| `TESTABILITY_BLOCKED` | No reliable script can be written against the application as built (e.g. no stable element id), the app was unreachable, or the authoring budget ran out. Next: Orchestrator adds hooks; no cycle consumed. |
| `FAIL_SPEC` | The requirement is ambiguous or contradictory. Next: Overseer; no cycle consumed. |
| **Review verdict** | `ACCEPT` or `FINDINGS`, at the top of `review_N.md`. |
| **Severity** | High / Medium / Minor, assigned by the Reviewer. High and Medium are fixed in the task; Minor goes to `log_system_defect.md` (`WFL-7-01`, `WFL-7-02`). |
| **[B] / [A]** | Blocking / Advisory tags on `COD`, `TST` (and stack) rules. A [B] violation is at least Medium; an [A] violation at most Minor (`DOC-11-03`). |
| **Rule code** | Permanent identifier `<FILE>-<SECTION>-<NN>`, e.g. `COD-6-01`, `TST-11a-03`. Cited instead of wording (`DOC-11-01`, `DOC-11-04`). |
| **Prefix** | The three-letter file part of a rule code: `PRJ`, `WFL`, `COD`, `TST`, `DOC`, plus one per project-specific rules file. |
| **RETIRED / reserved** | A deleted rule keeps its code marked `RETIRED <date>`; a code marked *(reserved)* in the generic files belonged to a stack- or project-specific rule. Neither is ever reused (`DOC-11-07`). |
| **REQ-nnn** | A requirement number in `requirements.md`. Sequential, permanent, assigned only by the Orchestrator (`PRJ-6-01`). |
| **DEF-nnn** | A defect number in `log_system_defect.md`. Sequential, permanent. |
| **Test No** | A scenario number in `test_scenarios.md`; matches `<no>` in `test<no>_<title>.py` (`TST-2-02`). |
| **Requirement → Task Map** | Table at the foot of `requirements.md` linking REQs to task folders. A REQ is `DONE` only when every task serving it is `DONE` or `CANCELED` (`DOC-10-02`). |
| **ACTIVE / DONE / CANCELED** | The status vocabulary for requirements, tasks and test scenarios (`PRJ-7-02`). |
| **Assertion change** | Changing what a test asserts or the expected value. Must be declared with a reason before the run (`TST-5-02`); an undeclared change is a High finding. |
| **Scenario before script** | The expected result is written into `test_scenarios.md` before the script first runs (`TST-4-01`). |
| **Sanctioned write path** | Creating or changing data only through the application's own requirement-built UI controls, never by direct SQL (`COD-11.4-02`, `TST-11a-01`). |
| **Refusal probe** | A hand-built request designed to be refused, proving a server-side safeguard (`TST-11a-10`). |
| **Compile check** | The Orchestrator's compile and import check of its own changes before handover (`PRJ-1.1-03`). |
| **Baseline / code snapshot** | The version of the code a review diff is taken against; a snapshot is a copy of source files saved in the task folder for that purpose (`agent_orchestrator.md` §4). |
| **Current State** | The rewritten top section of `log_development_activity.md` that lets a fresh agent catch up (`DOC-3-01`). |
| **Catch-up test** | Could a fresh Orchestrator resume from the files alone? (`DOC-9-02`). |
| **Close-out** | The seven steps after Gate 2 (`WFL-9-01`, `/log`). |
| **Environment fact** | Anything true of the machine or tooling that an agent had to discover; recorded in `notes_for_agents.md` (`DOC-8-01`). |
| **Reference implementation** | An existing project whose code is copied and adapted rather than rewritten, when one is designated (`COD-11.1-01`). |
