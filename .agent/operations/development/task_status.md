# Task Status Board — AI_Claude_Tools

Live state of work in flight. **Rewritten** at every handoff, never appended to. Maintained by
the Orchestrator (`DOC-2-02`, `DOC-7-01`).

The test for this file: **if the session ended now, could a fresh Orchestrator resume from this
board alone?** History belongs in `log_development_activity.md`, not here.

Last updated: YYYY-MM-DD HH:MM — *one line on why (handoff, session end, Gate decision)*.

---

## RESUME HERE (next session)

*The single most important next action, in one or two sentences.*

## In Flight

*One block per task in flight (at most two — `WFL-8-03` to `WFL-8-05`). Delete the example
block when the first real task starts.*

### `YYYY-MM-DD_task_name` (REQ-nnn) — STAGE

| | |
|---|---|
| Stage | `PLANNING` / `AWAITING_GATE_1` / `DEVELOPING` / `TESTING` / `REVIEWING` / `AWAITING_GATE_2` / `CLOSING` / `ESCALATED` |
| Held by | Orchestrator / Reviewer / Human Overseer (or an adopted optional agent) |
| Defect cycle | N of 2 |
| Authoring attempts | *per script, e.g. `test012`: 2 of 3* |
| Plan | `team_tasks/YYYY-MM-DD_task_name/plan.md` (*and revisions*) |
| Latest evidence | *`test_results_N.md`, `review_N.md`, raw output folder* |
| Review baseline | *commit, or `code_snapshot_<date>_<label>/`* |
| Next step | *exactly what happens next and who does it* |
| Waiting on | *Overseer decision / SQL to be created / nothing* |

## File-Overlap Check

*Required whenever two tasks are in development or one is in development while another is in
testing or review (`WFL-8-04`). List both plans' Affected Files and state "no shared file" or
the shared files and the decision taken.*

## Open Questions for the Human Overseer

*Numbered, so answers can be quoted back. Remove once answered and recorded in the governing
document.*

## Next Up

*The roadmap: which requirements get built, in what order, and why that order. Not per-task
detail — a task's plan lives in its task folder. A scoping plan's approved build order
(`WFL-1a-01`) is copied here. A completed task is removed at close-out (`WFL-9-01` step 7).
New requirements the Overseer raises go in with no Order until they are scheduled.*

| Order | Work item | Requirements | Depends on | Notes |
|---|---|---|---|---|
| 1 | | REQ-nnn | — | |
