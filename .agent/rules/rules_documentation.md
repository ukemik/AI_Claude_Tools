# Documentation Rules — AI_Claude_Tools

Who writes which document, when, and whether it is appended to or rewritten. Also the registry of
rule codes for every file in `.agent/rules/` (§11).

Every rule has a code `DOC-<section>-<NN>`. Scheme: §11.

---

## 1. Ownership

- **DOC-1-01** Each document is written only by its owner — the Orchestrator, or an adopted
  optional agent for its own documents — at the time given in the document table,
  `rules_agent_workflow.md` PRJ §5.

- **DOC-1-02** Documentation is part of the change, not a follow-up task. A change to behaviour
  without the matching update to `user_manual.md` is not finished.

## 2. Append-Only vs Rewritten

This distinction matters and is easy to get backwards.

- **DOC-2-01** **Append-only** — never edit or delete an existing entry:
  - the changelog section of `log_development_activity.md`
  - `log_development_activity_archive.md`
- **DOC-2-02** **Rewritten in place** — replaced wholesale each time so it always reflects now:
  - the "Current State" section of `log_development_activity.md`
  - `task_status.md`
  - `system_design.md`
- **DOC-2-03** **Row-updated** — rows are added and their Status changes, but a row is never
  deleted and its identifier is never reused:
  - `requirements.md` (REQ numbers)
  - `test_scenarios.md` (Test numbers)
  - `log_system_defect.md` (DEF numbers)

## 3. `log_development_activity.md`

Two sections.

- **DOC-3-01** **Current State** — rewritten every time. This is what lets a fresh agent catch up,
  and it is the reason a 7-day changelog window is survivable. If this section is stale, the
  archive rule destroys the project's memory.
- **DOC-3-02** **Development Log & Changelog** — append-only, newest entry at the top, format:

```
[YYYY-MM-DD]
[Task]: team_tasks/YYYY-MM-DD_task_name
[Requirements]: REQ-nnn, REQ-nnn
[Action Taken]: Brief summary of the change.
[Reasoning/Purpose]: Why it was done, technically.
[Current State]: Status of the feature after this change.
```

## 4. Archiving

- **DOC-4-01** At task close, the Orchestrator moves every changelog entry dated more than 7 days
  ago into `log_development_activity_archive.md`, verbatim and in order. The active file stays
  small enough to load cheaply every session; the archive is the audit trail and is not expected
  to be read.
- **DOC-4-02** This only works if "Current State" is genuinely current. Check it before archiving.

## 5. `requirements.md`

- **DOC-5-01** The table has these columns:

| Column | Content |
|---|---|
| Req No | `REQ-nnn`. Assigned sequentially by the Orchestrator in creation order. **Permanent** — never reused, never renumbered, retained even when `CANCELED`. |
| Requirement | What the application must do. |
| Status | `ACTIVE`, `DONE`, `CANCELED`. |
| Status Date | `YYYY-MM-DD` of the last status change. |
| Notes | Constraints, decisions, links to related requirements. |

- **DOC-5-02** Requirements are grouped into sections by screen or functional area. Numbers within
  a section need not be contiguous — grouping is for readers, sequence is for traceability.
- **DOC-5-03** Any requirement that is not `DONE` is upcoming work. There is no separate backlog
  document.

## 6. Docstrings

- **DOC-6-01** Every new or modified function carries the four sections defined in
  `COD-3-05`: Description, Parameters, Return Values, Notes.
- **DOC-6-02** Never rewrite a docstring or comment that the current task did not touch, unless it
  is functionally incorrect (`COD-12-03`).

## 7. Update Triggers

Documents go stale between task closes, not at them. These triggers exist so the records stay
true mid-flight.

- **DOC-7-01** On each trigger, make the update shown:

| Trigger | Update |
|---|---|
| Session start | Reconcile `task_status.md` against what is on disk. A stale board is worse than none. |
| A new requirement is agreed | `requirements.md`, **before** work on it starts |
| Every change of stage (plan, Gate 1, work, run, review, Gate 2) | `task_status.md` |
| A scoping plan is approved | REQ numbers assigned for flagged gaps; Next Up in `task_status.md` re-sequenced |
| An agent reports an environment fact | `notes_for_agents.md` |
| A survey corrects an architectural assumption | `system_design.md` |
| The Reviewer defers a minor finding | `log_system_defect.md`, with a written rationale, not just a table row |
| A defect is fixed | Close the `log_system_defect.md` entry |
| The Human Overseer makes a decision | The governing document (requirement, plan, Next Up in `task_status.md`), in the same turn |
| The Human Overseer sets or changes a rule | The relevant `rules_*.md`, coded per §11, in the same turn |
| An environment variable is added, renamed, removed or changed (`COD-19-04`) | `system_design.md` "Environment Variables" and every installation, deployment and IQ document. A document that does not exist yet goes into `task_status.md` and `log_system_defect.md` as open until written |
| Task close | `rules_agent_workflow.md` WFL §9 (`WFL-9-01`), all seven steps |
| Session end, mid-task | `task_status.md` must alone be enough to resume |

## 8. `notes_for_agents.md`

Environment facts: the app URL and its startup timing, database roles and schemas, tool paths,
shell quirks, and any behaviour that looks like a defect but is not.

It exists to stop rediscovery. Subagents share no context, so a fact learned in one dispatch is
paid for again in the next unless it lands here.

- **DOC-8-01** When an agent reports an environment fact in its return message, the Orchestrator
  writes it in — that is the whole mechanism.
- **DOC-8-02** Correct a wrong entry rather than leaving it. A stale note is worse than a missing
  one, because an agent will trust it.

## 9. Catch-Up Test

- **DOC-9-01** The standing requirement on this documentation set: a fresh agent with no history
  should be able to read `CLAUDE.md`, then `rules_agent_workflow.md`, then `notes_for_agents.md`, then
  `log_development_activity.md` and `task_status.md`, and understand the application's purpose,
  its current state, the environment it runs in, and what happens next — without any chat
  history.
- **DOC-9-02** The sharper version, which the Orchestrator should apply continuously: **if this
  session ended right now, could a fresh Orchestrator resume from the files alone?** If not, the
  records are behind. Nothing important may live only in the conversation.

If that stops being true, the documentation has failed regardless of how complete it looks.

## 10. Requirement → Task Map

**A requirement can have more than one task, and a task can serve more than one requirement.**
Neither is the exception.

- **DOC-10-01** The map at the foot of `requirements.md` records the relationship. It is owned by
  the **Orchestrator**, because it owns `requirements.md` and is the only actor that sees a task
  from dispatch to close. Maintain it as follows:

| When | Do |
|---|---|
| A task folder is created | Add a row: the REQs in scope, the task folder, status `ACTIVE` |
| Task close-out | Set the task's status to `DONE` or `CANCELED`, with the date |
| Task close-out | **Only then** consider the requirement itself |

- **DOC-10-02** The rule that keeps the two consistent: **a requirement is `DONE` only when every
  task serving it is `DONE` or `CANCELED`.** A requirement with one finished task and one
  outstanding task stays `ACTIVE`. Marking it `DONE` early is the most common way a requirements
  table starts lying.

Task status is tracked independently of requirement status. A `CANCELED` task against an
`ACTIVE` requirement is a normal state — it means that approach was abandoned, not that the
requirement went away.

## 11. Rule Codes

*Every rule in every `rules_*.md` file carries a code that identifies the file and the section it
comes from.*

### The scheme

- **DOC-11-01** A rule code has the form **`<FILE>-<SECTION>-<NN>`**:
  - `FILE` is the file's three-letter prefix from the table below.
  - `SECTION` is the section number exactly as in the heading, unpadded and including any dot or
    letter: `6`, `11.4`, `11a`, `4a`, `1a`.
  - `NN` is two digits, sequential within that section, starting at `01`.

  Examples: `COD-6-01`, `COD-11.4-02`, `TST-11a-03`, `WFL-4a-01`.

| Prefix | File | Tags |
|---|---|---|
| `COD` | `rules_coding.md` | `[B]` / `[A]` |
| `TST` | `rules_testing.md` | `[B]` / `[A]` |
| `DOC` | `rules_documentation.md` | none — process rules |
| `PRJ` | `rules_agent_workflow.md` (sections headed PRJ; former `rules_project.md`) | none — process rules |
| `WFL` | `rules_agent_workflow.md` (sections headed WFL) | none — process rules |
| `STK` | *(example only, not a rules file in force)* the package's `examples/rules_coding_stack_example.md`. A project that adapts it saves it as `.agent/rules/rules_coding_<stack>.md` with a real prefix | `[B]` / `[A]` |
| `VAL` | *(optional agent, in force only when adopted)* `rules_validation.md`, from the package's `optional_agents/validation_writer/` | none — process rules |
| *(add)* | *one row per project-specific `rules_<topic>.md`* | |

- **DOC-11-02** **What gets a code:** every normative statement — must, never, always, do, do not,
  only. Descriptive prose, tables of facts (folder structure, file purposes, team descriptions) and
  examples stay uncoded. A table that *is* a rule gets one code on the line that introduces it.
  Rules under an unnumbered `###` subheading take the parent numbered section.
- **DOC-11-03** **Severity tags** apply to code- and test-facing rules (`COD`, `TST`, and any
  stack file), because the Reviewer audits code and test scripts against them: **[B] Blocking** —
  a violation is at least Medium, fixed in the task; **[A] Advisory** — at most Minor, never by
  itself grounds to reject. Defined in `rules_coding.md` "How to Use This File".
- **DOC-11-04** **Cite codes, not wording or section numbers,** in plans, briefs, handoffs, review
  findings and defect entries.

### Assigning and changing codes

- **DOC-11-05** A new rule takes the **next `NN` in its section** — read the last code in that
  section and add one. Never fill a gap.
- **DOC-11-06** Codes are **permanent**: never reused and never renumbered, even if the rule's
  text later moves to another section. A moved rule keeps its original code.
- **DOC-11-07** A deleted rule keeps its code in place, marked **`RETIRED <YYYY-MM-DD>`** with a
  one-line reason. A code marked *(reserved)* in the generic files is treated the same way: never
  reused for a different rule.
- **DOC-11-08** A new rules file gets a new three-letter prefix, added to the prefix table above.
  **Project-specific rules go in their own `rules_<topic>.md` file**, not into the generic files,
  so the generic files stay comparable across projects.
- **DOC-11-09** A new numbered section gets a number that does not disturb existing ones (for
  example `7a` between §7 and §8). **Never change an existing section number** — other documents
  cite them.
- **DOC-11-10** Only the **Orchestrator** adds or changes rules, and only at the Human Overseer's
  direction. Record the date with the rule, and make the change in the same turn the direction is
  given (§7).
- **DOC-11-11** A project-specific rules file, including an adopted optional agent's, may add to,
  narrow, or state an exception to a generic rule only by saying so explicitly and citing the code
  it amends. The amendment then governs in that project, including over every restatement of the
  rule in role files, `CLAUDE.md` and `GLOSSARY.md`.
