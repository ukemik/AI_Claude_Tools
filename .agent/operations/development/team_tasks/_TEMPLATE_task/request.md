# Request: <task name>

*Template. The Orchestrator copies `_TEMPLATE_task/` to `YYYY-MM-DD_task_name/` (`PRJ-7-01`)
and fills this file in before starting the work. Delete the italic guidance as you go. The other
template files: `plan.md` (only if the task needs one, `WFL-4-02`; otherwise delete it),
`test_results_1.md` (Orchestrator, before the review), `review_1.md` (from the Reviewer's
report). Delete any that the task does not reach.*

Date: YYYY-MM-DD
Task folder: `team_tasks/YYYY-MM-DD_task_name`
Requirements: REQ-nnn, REQ-nnn *(already present in `requirements.md` — `DOC-7-01`)*
Plan: Task plan | Scoping plan | **None** — *the `WFL-4-02` condition(s) checked, and why none
holds*

## The Overseer's Request (verbatim)

> *Quote the Human Overseer's words exactly. Do not paraphrase — the Reviewer judges the work
> against this when there is no plan.*

## Constraints and Decisions Already Made

*Every Overseer decision relevant to this task, with its date, and where it is recorded. Things
the Overseer has closed and must not be re-raised.*

## Out of Scope

*What this task deliberately does not do, and which requirement or task covers it instead.*

## Known Hard Stops

*Any foreseeable dependency change, schema change / new database function, or constructor change
(`WFL-5-01`). "None known" is a valid answer. Anything needed outside `AI_Claude_Tools/` is listed
here as a change for the Overseer to make — no agent may make it (`COD-1-01`).*

## Approach (when there is no plan)

*Two or three lines: what changes, in which files, how it will be checked. Environment variables
(`COD-19-05`): list, or "None".*

## Requirement → Task Map

- [ ] Row added to the map at the foot of `requirements.md` with status `ACTIVE` (`DOC-10-01`).
- [ ] `task_status.md` updated.
