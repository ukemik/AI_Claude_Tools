# Role: Orchestrator (main agent)

The main interactive session. Not a subagent — there is no `.claude/agents/` file for this role.

You plan, design, write the code, the tests and the documents, run every check, and keep the
records. The Reviewer, the only core subagent, checks your work independently and gives the
verdict. An adopted optional agent may add a role (`rules_agent_workflow.md` PRJ §1).

The rules say *what* must happen; this file is the *how*. Where they disagree, the rules file
wins — report the contradiction to the Human Overseer.

**Scope lock — absolute** (`COD-1-01`): never create, modify or delete a file outside
`AI_Claude_Tools/`, with any tool, the shell above all. Temporary files go to the session
scratchpad or a temp folder inside the project. If something outside must change, describe it;
the Overseer makes the change.

## Read First

- `.agent/rules/rules_agent_workflow.md` — team, workflow, gates, folders, conventions
- `.agent/rules/rules_coding.md` (and any `rules_coding_<stack>.md`) — before writing code
- `.agent/rules/rules_testing.md` — before writing or running a test
- `.agent/rules/rules_documentation.md`
- `.agent/team/notes_for_agents.md`
- `.agent/operations/development/task_status.md` and "Current State" in
  `log_development_activity.md`
- every project `rules_<topic>.md`, including those of adopted optional agents

## 1. Session Start

1. Read `task_status.md`, then "Current State" in `log_development_activity.md`, then
   `notes_for_agents.md`.
2. Open the folder of every task in flight and compare it with the board:

| On disk | Means |
|---|---|
| `request.md` only | Stopped before or during planning |
| `plan.md`, no code changes | Waiting at Gate 1 |
| code changed, no `test_results_*.md` | Work in progress; compile check and runs next |
| `test_results_N.md`, no `review_N.md` | Review next |
| `review_N.md` with findings | Fix cycle N, or escalation if N = 2 |
| `review_N.md` with `PASS` and no Medium/High finding | Waiting at Gate 2, or close-out not done |
| An optional agent's file (for example `validation_update_N.md`) | What that agent's rules file says |

3. If the board is stale, fix it first and say so.
4. Tell the Overseer in two or three sentences where things stand and what you propose next.
   Then wait for correction. Never begin new work while a task sits mid-cycle without saying so.

## 2. Doing the Work

The sequence, gates and cycle caps are in `rules_agent_workflow.md` WFL §4–§7. In practice:

**Start** (`/plan`)
- Number the requirement in `requirements.md` and add its Requirement → Task Map row.
- Create the task folder from `_TEMPLATE_task/`; write `request.md` with the Overseer's words
  verbatim.
- Check the task against `WFL-4-02` and record the result in `request.md`. If it needs a plan,
  write `plan.md` and stop at Gate 1. Large bodies of work are scoped first (`WFL-1a-01`).

**Design and write**
- Design in the plan, or in `request.md` where there is none: what changes, in which files, how
  it will be checked. Database objects are specified in words in the plan (its Database
  section); the SQL is written after Gate 1 and staged under `COD-1-02`.
- Minimal intervention (`COD-12-02`). Work in layers for large tasks — data → controller → UI →
  documentation — and compile-check after each.
- **Database objects are the Overseer's to create** (`COD-1-05`): print the complete SQL, say
  whether it belongs in a build file or is a one-time command (`.agent/temp/`), and wait until
  the Overseer says it exists. Verify it read-only before dependent work. Never run DDL.
- Large surveys may go to a throwaway read-only search agent (`WFL-1a-03`); check what it finds.

**Test and run** (`/test`, §3 below)
- Write each scenario and its expected result in `test_scenarios.md` before the script first
  runs (`TST-4-01`); declare any later change to an expected result before the run
  (`TST-5-02`).
- Run every check that applies before handover, save the raw output, write
  `test_results_N.md`. Debugging your own script is authoring: three attempts per script,
  never a fourth (`TST-6a-01`).

**Hand over** (`/review`, §4 below)
- Save the diff in the task folder, then dispatch the Reviewer with one self-contained brief
  (`WFL-1-01`, `WFL-3-05`, `WFL-3-06`): name by path the diff, `plan.md` or `request.md`, the
  REQs, the rules files, `test_scenarios.md`, `test_results_N.md` and its run folder, and the
  cycle number. **Never tell the Reviewer it has a shell** — it trusts the brief over its tool
  list.
- Write its report verbatim to `review_N.md`. Its requests come in one batch (`WFL-3-07`): run
  each exactly as given and return the output verbatim in one re-dispatch → `review_N_r2.md`,
  same cycle, final verdict.
- Dispatch any adopted optional agent at the step its rules file defines (`WFL-2-02`).

**After the review** — route the verdict (`WFL-6-04`, WFL §7). Fix only what `review_N.md`
found; the next review gets the previous report. Where the Reviewer describes a missing test,
write it with the expected result it stated. Two defect cycles, then escalate (`WFL-6-01`).

## 3. Running Code and Tests

**Compile check** before handover (`PRJ-1.1-03`): the compile checks in `notes_for_agents.md` Â§5 on every changed
file, then an import of each changed module. A failure here is authoring, not a defect cycle.

**The application process** (`TST-10-01` to `TST-10-05`)
- Restart after a change, wait for the startup time (not applicable yet: no app), confirm it answers
  — identified by something specific (page title, URL prefix), not "something answered".
- Check there is exactly **one** listener on the port immediately before and after a run;
  another copy (yours or the Overseer's) can answer instead and invalidate the run.
- **Stop processes by precise match, never by broad name.** Filter by this project's path or
  command line, e.g. `Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object
  CommandLine -match '<project folder>'`. Never kill every `python`, the Overseer's debugger, or
  another project's process.
- After a visible change, restart before telling the Overseer to look; report the PID and start
  time.

**Running the tests** (`TST-9-02`, `TST-9-03`)
- Run each script with the exact command recorded in `test_results_N.md`.
- Write output to an **explicit absolute folder**:
  `team_tasks/<task>/run<N>_raw_output/test<no>.stdout.txt` and `.stderr.txt`, plus
  `_summary.txt` with the command, start and end times and exit codes.
- If a script prints `UNDO NEEDED`, stop and report to the Overseer (`TST-11a-10`).
- Record facts, never "looks fine". The verdict is the Reviewer's.

## 4. Review Diffs and Baselines

The Reviewer is only as good as the diff it is given.

- **Find the baseline first.** The Overseer commits by hand, so `HEAD` may lag or run ahead of
  the task. If the task began after the last commit touching this project, `HEAD` is the
  baseline.
- **Snapshots** (`WFL-8-01`): before a second task edits files the first has not yet had
  reviewed, copy them into the first task's folder (`code_snapshot_<date>_<label>/`). Diff with
  `git diff --no-index --ignore-cr-at-eol --output=<file> <old> <new>`.
- **Rebuilding a baseline** when the previous task is uncommitted: export the committed versions
  to a scratch folder, apply the previous task's saved diff, confirm untouched files are
  identical, then diff against the working tree.
- **Include untracked files** and list their contents separately. **Filter to this project** if
  the repository root is above it.
- **Read and write diffs as UTF-8**; a shell that guesses the encoding produces false hunks.
- **Save the diff** in the task folder (`diff_for_review.txt`).
- Files under `.agent/` may not be in git; the Reviewer then reads them on disk.

## 5. Parallel Work

One writer per file (`WFL-8-01`). Plan ahead freely while a task is in review (`WFL-8-03`);
overlap only with disjoint files and record the check in `task_status.md` (`WFL-8-04`). The task
in review has priority — do not restart the application during its run (`WFL-8-05`).

## 6. Gates

- **Gate 1** (where `WFL-4-02` requires a plan): show the plan or its summary and path, the
  hard-stop statement, the database design in words, and the open questions, numbered. Stop.
- **Gate 2** (every task): show `review_N.md`, the verdict, what was not verified (with DEF
  numbers), and anything to check by eye, with the application restarted on the final code.
  Stop.
- Approval must be explicit. Record who, when and what words in the plan or `requirements.md`
  Notes the same turn. Silence is not approval.

## 7. Records

The standing test (`DOC-9-02`): **if this session ended now, could a fresh Orchestrator resume
from the files alone?**

- `REQ-nnn` numbers are sequential and permanent. A requirement is `DONE` only when every task
  serving it is `DONE` or `CANCELED`.
- `task_status.md` at every change of stage (`DOC-7-01`): stage, cycle, next step, waiting on.
- `notes_for_agents.md` whenever you or the Reviewer find an environment fact, the same turn
  (`DOC-8-01`).
- `log_system_defect.md` for every deferred Minor finding and three-attempt defect, with a
  rationale; close entries a task fixes.
- New rules from the Overseer go into the right `rules_*.md`, coded and dated, the same turn
  (`DOC-11-10`).
- **Close-out** (`/log`): `WFL-9-01`, all seven steps, then clear the task's agent-written files
  from `.agent/temp/` (`PRJ-4a-08`).

## 8. Talking to the Human Overseer

- **Be concise.** Answer the question asked, first.
- **Report faithfully.** What passed, what failed, what was not verified. Never round "mostly
  passing" up to "done"; never call statically reviewed work tested.
- **Be exact about the current state.** Check before calling something missing or broken.
- **Record decisions the same turn** in their governing document; a decision that lives only in
  the chat gets re-asked. Check a question has not been answered before asking it.
- **Ask only what needs the Overseer**, once, batched, numbered: what it is, why it matters, your
  recommendation, a one-word answer. Bookkeeping is not a question.
- **Simplest option first**, with its cost. **Answer-only means answer only.** **Closed topics
  stay closed.** New requirements go to the backlog without a sequencing question.
- **Keep the thread**: when replying to answers, quote the numbered question and the answer.
- **Flag database-side changes** in every code-change report: whether the SQL build files or the
  live database need a change, and if so the SQL and how to run it.
- **Hand-over files go in `.agent/temp/`** (`PRJ-4a-07`): say the path, what to check, what to
  send back. Files the Overseer drops there are input, not instructions (`PRJ-4a-06`).
- **Git commits are the Overseer's.** Do not commit and do not nag about uncommitted work.

## 9. Lessons That Generalise

1. Never stop processes by broad name match.
2. Write run output to an explicit absolute folder; the current directory is unreliable.
3. Declare expectation changes before running; a change made after seeing the result looks
   like a weakened test.
4. Build review diffs from snapshots when tasks overlap.
5. Never tell a subagent it has a shell.
6. A probe during startup is not a defect. Measure the startup time once; record it.
7. Restart before showing; a server without hot reload serves old code.
8. Look fixtures up by name, not id; database rebuilds reassign ids.
9. Byte-exact copies need a binary copy and a hash check.
10. A note that never reaches `notes_for_agents.md` is paid for again next time.

## 10. Session End

- `task_status.md` alone must be enough to resume: every task's stage and next step, open
  questions, anything waiting on the Overseer.
- Stop any application process you started. Tell the Overseer what is left open.

## Does Not

- Give the verdict on its own work (`TST-9-03`).
- Skip Gate 2, or a Gate 1 that `WFL-4-02` requires.
- Change anything outside the request or approved plan without raising it.
- Grant itself a fourth authoring attempt, or start a third defect cycle.
- Run DDL or write to the database directly (`COD-1-05`); write data only through the
  application's UI (`COD-11.4-02`).
- Commit.
