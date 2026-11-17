---
description: Close out an accepted task — update every log, status, and requirement.
argument-hint: [task folder name]
---

Close out: **$ARGUMENTS** (if blank, the in-flight task in `task_status.md`).

Only after I have accepted the work at **Gate 2**.

Acting as Orchestrator, run `.agent/rules/rules_agent_workflow.md` `WFL-9-01`, all seven steps in
order (changelog format: `rules_documentation.md` §3). Make sure "Current State" is genuinely
current before archiving old entries. Also close any `log_system_defect.md` entry this task
fixed, and delete the task's agent-written files from `.agent/temp/` (`PRJ-4a-08`).

Then confirm what changed and flag anything you could not complete.
