---
description: Start a new task — number the requirement, create the dossier, and write plan.md if the task needs one.
argument-hint: <task name> [REQ-nnn, REQ-nnn ...]
---

Start a new task: **$ARGUMENTS**

Acting as Orchestrator, follow `.agent/team/agent_orchestrator.md` §2 "Start":

1. Confirm the REQs in scope exist in `requirements.md`, or assign the next number and tell me
   which. Add the Requirement → Task Map row.
2. Create `team_tasks/<YYYY-MM-DD>_<task_name>/` from `_TEMPLATE_task/`; put my request in
   `request.md` verbatim.
3. Check the task against `WFL-4-02` and record the result in `request.md`. Plan needed → write
   `plan.md`, show it to me and stop at **Gate 1**. No plan needed → tell me why in one line and
   start.
4. Update `task_status.md`.
