# Requirements — AI_Claude_Tools

The source of truth for what this application must do. The Orchestrator plans from it and the Reviewer judges against it; every
test scenario names the requirement it verifies. Maintained by the Orchestrator.

**Rules** (see `.agent/rules/rules_documentation.md` §5 and §10):

- `REQ-nnn` numbers are assigned sequentially by the Orchestrator in creation order and are
  **permanent** — never reused, never renumbered, retained even when `CANCELED`.
- Numbers are grouped into sections by screen or functional area, so they need not be contiguous
  within a section.
- Status is `ACTIVE`, `DONE`, or `CANCELED`. **Any requirement that is not `DONE` is upcoming
  work** — there is no separate backlog.
- A requirement is updated **before** work on it starts (`DOC-7-01`).
- Record the Overseer's words and decisions, with dates, in Notes.

**Next number to assign: REQ-001.**

---

## 1. *Functional area (e.g. Authentication & Session)*

| Req No | Requirement | Status | Status Date | Notes |
|---|---|---|---|---|

## 2. *Functional area*

| Req No | Requirement | Status | Status Date | Notes |
|---|---|---|---|---|

## 3. Platform & Runtime

| Req No | Requirement | Status | Status Date | Notes |
|---|---|---|---|---|

---

## Requirement → Task Map

A requirement is satisfied by one or more tasks, and a task may serve several requirements.
This map is the link between the two. Maintained by the **Orchestrator** — a row is created when
a task folder is created, and its status updated at every close-out. See
`../../rules/rules_documentation.md` §10.

Task status is `ACTIVE`, `DONE`, or `CANCELED`, independent of the requirement's own status: a
requirement is only `DONE` when every task serving it is `DONE` or `CANCELED`.

| Req No | Task Folder | Task Status | Status Date | Notes |
|---|---|---|---|---|
