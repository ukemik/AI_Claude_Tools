# Plan: <task name>

*Template — written by the Orchestrator, **only for a task that needs a plan** under `WFL-4-02`
(check its numbered conditions). Otherwise delete this file and record in `request.md` the
condition checked and why no plan is needed. A
**scoping plan** covers survey, gaps and build order only (`WFL-1a-01`). Cite rule codes, not
wording (`DOC-11-04`). Delete the italic guidance.*

Date: YYYY-MM-DD
Task: `YYYY-MM-DD_task_name`
Requirements: REQ-nnn, REQ-nnn *(every task item traces to one — `PRJ-6-03`)*

## 0. Hard-Stop Statement

*Either "This plan contains no hard stop" or a list: dependency changes, schema changes / new
database functions, constructor (`__init__`) changes (`WFL-5-01`). Each needs the Human
Overseer's approval. A plan never includes a change to a file outside `AI_Claude_Tools/`
(`COD-1-01`); if one is needed, describe it here for the Overseer to make.*

## 1. Objective

*One paragraph. What will be true when this is done.*

## 2. Current State / Survey

*What exists today in the files this task touches. If a reference implementation exists
(`COD-11.1-01`), what it does, with file and line ranges.*

## 3. Approach

*The design decision and why. Lead with the smallest workable option.*

Rejected:
- *option — reason*

### Context Adaptation Table

*Required for any plan touching data where `COD-8-01` applies: where each context identifier
enters — which data-layer call, which handler, which filter. Write "Not applicable — reason"
otherwise.*

| Call / handler / filter | Identifier used | Source of the value |
|---|---|---|

## 4. Affected Files

*Respect the file responsibility map in `rules_coding.md` §2 (`COD-2-01`). This table is what
the file-overlap check (`WFL-8-04`) compares.*

| File | Change | Layer |
|---|---|---|

## 5. Task List

*Numbered, ordered, each item small enough to verify independently. Group by layer — data,
controller, UI, test scripts and scenarios, documentation (`DOC-1-02`) — and compile-check after
each.*

1.

## 6. Environment Variables (`COD-19-05`)

*Every environment variable the task adds, renames, removes or changes, with the documents
`COD-19-04` requires — or "None".*

## 6a. Database

*Existing functions to reuse (from not applicable yet (no database) or `notes_for_agents.md` §2), or new
functions and tables needed. A new function or schema change is a HARD STOP (`COD-12-04`).
Specify it **in words only — never SQL, DDL or code**: for a table, each column (name, type,
nullable, default), the keys, constraints, indexes and relations; for a function, its name,
parameters and types, what it reads and writes, what it returns and which role executes it.
After Gate 1 the Orchestrator writes the SQL to `sql/` and prints it for the Overseer
(`COD-1-02`, `COD-1-05`). Write "None" if not applicable.*

## 7. Test Guidance

*What will be checked for each requirement, and how (unit / server / browser / manual). Include regression guards: existing scenarios whose expected values this task
will change (declared before the run, `TST-5-02`), and anything only the Overseer can check by eye
at Gate 2.*

| Requirement | Verify | How |
|---|---|---|

## 8. Requirement Gaps

*Anything needed that no requirement covers. Number it in `requirements.md` before work starts.*

## 9. Risks and Open Questions

### Open questions

*Numbered. Anything the Human Overseer must decide before work starts. Contradictions between
approved documents go here, unresolved (`WFL-4a-04`).*

1.

### Risks

-
