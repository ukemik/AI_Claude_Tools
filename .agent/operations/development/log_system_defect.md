# System Defect Log — AI_Claude_Tools

**Deferred defects, and unverified requirements.**

Severity is assigned by the Reviewer. Anything **medium or high** is fixed immediately within the
task that found it (`WFL-7-01`). If an open defect would block a task from being accepted, it was
not minor — fix it instead of logging it (`WFL-7-03`).

**One standing exception puts entries here that the rule above would otherwise keep out — the
three-attempt rule** (`TST-6a-01`). *Testing must not stall delivery.* If a test script returns
an error on three attempts, it is logged here and work continues with the next test or task.
Three is a hard cap; a fourth attempt needs the Human Overseer's explicit say-so. The entry must
name the **requirement left unverified** and say whether the fault is the application's, the
script's, or genuinely undetermined — "undetermined" is a complete answer. And if the blocked
test or function is a prerequisite for the team to continue, work stops and the Human Overseer is
told, rather than the problem being retried.

So this file is also the register of **what is not proven**, not only of what is broken. An entry
recording an unverified requirement is doing its job.

Entries are added by the Orchestrator when the Reviewer defers something or a test is logged under
the three-attempt rule, and closed by the Orchestrator when a later task fixes it. Rows are never
deleted and DEF numbers are never reused (`DOC-2-03`). Each entry has a table row **and** a
detail section with a written rationale (`DOC-7-01`).

See `../../rules/rules_agent_workflow.md` §7 and `../../rules/rules_testing.md` §6a.

**Next number to assign: DEF-001.**

---

## Register

| Def No | Defect | Found In | Found On | Severity | Status | Closed On | Closing Task |
|---|---|---|---|---|---|---|---|

---

## Details

*One section per entry, newest last. Template:*

```markdown
## DEF-nnn — <short title>

- **Found:** YYYY-MM-DD, task `YYYY-MM-DD_task_name`, by <Reviewer | Orchestrator>
- **Severity:** Minor (or, for a three-attempt entry: the requirement left unverified)
- **Rule / REQ:** <rule code or REQ-nnn>
- **Observed:** <what happened, concretely>
- **Expected:** <what should have happened>
- **Fault believed to be:** application | script | undetermined
- **Why deferred:** <the rationale — why this is safe to leave>
- **What would settle it:** <fixture, tool, requirements decision, different observation point>
- **Closed:** <YYYY-MM-DD, task, how — or "open">
```
