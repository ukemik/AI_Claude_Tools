# Testing Rules — AI_Claude_Tools

Binding on the Orchestrator, which writes and runs the tests. The Reviewer audits the tests and
their saved output against this document, and gives the test verdict.

**Two-agent model** (package 2.0). There is no separate Tester. The author of the work writes and
runs its tests; the Reviewer, which did not write them, checks them against the requirements and
judges the result.

Every rule has a code `TST-<section>-<NN>` and a severity tag — **[B]** blocking, **[A]**
advisory — defined in `rules_coding.md` "How to Use This File". Scheme: `rules_documentation.md`
§11.

---

## 1. What a Testing Activity Produces

- **TST-1-01 [B]** Every testing activity produces all three:
  1. **`test_scenarios.md`** — the verbal description of what each test verifies.
  2. **`py/test<no>_<title>.py`** — the script that performs the test.
  3. **`test_functions.md`** — the catalogue of reusable helpers, updated if any were added.

## 2. Naming and Layout

- **TST-2-01 [B]** Name and place artifacts as follows. Helpers are grouped by area of use — for
  example `util_file.py`, `util_web.py`, `util_browser.py`, `util_db.py`.

| Artifact | Format | Location |
|---|---|---|
| Test script | `test<no>_<test_title>.py` | `.agent/operations/testing/py/` |
| Shared helper module | `util_<area_of_use>.py` | `.agent/operations/testing/py/` |

- **TST-2-02 [B]** `<no>` matches the Test No in `test_scenarios.md`.

## 3. Reuse

- **TST-3-01 [B]** Read `test_functions.md` **before** writing any helper.
- **TST-3-02 [B]** If a function already exists that serves the purpose, use it; do not write a
  second one.
- **TST-3-03 [B]** Reuse applies to helpers, not to test scripts. Do not split or merge test
  scripts in pursuit of reuse — one scenario, one script, so that requirements and tests map to
  each other cleanly.

## 4. Scenario Before Script (CRITICAL)

- **TST-4-01 [B]** The scenario and its **expected result** are written into `test_scenarios.md`
  before the script is first run.

This exists to defeat the worst failure mode in test authoring: an author that iterates on a
failing script until it passes, quietly weakening what it asserts, turning a real defect into a
green check. Committing the expectation first means "is the expectation correct?" has a written
answer that predates the first failure.

## 5. The Assertion-Change Rule

During authoring iteration:

- **TST-5-01 [B]** Changing **selectors, waits, fixtures, or setup** is free. These are script
  mechanics.
- **TST-5-02 [B]** Changing **an assertion or an expected value** is not. It must be recorded in
  `test_results_N.md` with a reason — **before the run that uses it** — and it is an automatic
  Reviewer checkpoint. The same applies when a later task changes an existing scenario's expected
  values: declare it in the scenario row and in that task's `test_results_N.md` first.

## 6. Two Loops, Not One

**Authoring iteration** is the Orchestrator debugging its own script before handover — wrong
selector, race condition, bad fixture. The application is not implicated, nothing hands off, and
it happens before the Reviewer is dispatched.

**Defect iteration** is a sound script failing, or the Reviewer finding a defect, because the
application is wrong. It goes back to the Orchestrator as a fix cycle and is capped at two cycles.

- **TST-6-01 [B]** Each loop has a fixed budget:

| Loop | Budget | On exhaustion |
|---|---|---|
| Authoring attempts | **3 per script**, hard | Log a defect and move on — §6a |
| Defect cycles | 2 | Escalate to the Human Overseer |

## 6a. The Three-Attempt Rule — Log It and Move On

**Standing instruction.** Testing must not become the thing that stalls delivery. Browser and UI
scripts are the usual culprit: they fail for reasons neither clearly the application's nor
clearly the script's, and chasing that distinction can absorb unlimited effort.

- **TST-6a-01 [B]** **If a test script returns an error on three attempts, stop.** Log it in
  `log_system_defect.md` and continue with the next test or task.
- **TST-6a-02 [B]** **Three is a hard cap, not a target to argue with.** It counts attempts at
  getting *that script* to produce a trustworthy result, whatever the cause. A fourth attempt
  requires the Human Overseer's explicit say-so — do not grant it to yourself.
- **TST-6a-03 [B]** Do not reset the count by restructuring the same script into a "new" one.

Then one of two things happens, and telling them apart is the only judgement left:

- **TST-6a-04 [B]** **(a) The rest of the suite can proceed without it.** Log the defect, move to
  the next test, and carry on. This is the normal case.
- **TST-6a-05 [B]** **(b) That test or function is a prerequisite for the team to continue.**
  **Stop and raise it with the Human Overseer.** Do not keep working at it. A blocker that needs a
  decision, a fixture, or a tool is not solved by persistence, and the time spent discovering
  that is wasted twice over.
- **TST-6a-06 [B]** Log the repeated failure according to what it looks like — the entry cuts both
  ways, which is the point:

| The repeated failure looks like | Log it as | Then |
|---|---|---|
| The application behaving wrongly | A defect against the application | Continue; verdict `FAIL_DEFECT` only if it blocks acceptance |
| The expected behaviour being unclear, or the script unable to observe it reliably | A defect **about the test gap**, naming what could not be verified and why | Continue; do not report the application as faulty |
| Undetermined after three attempts | Exactly that — **"undetermined" is a complete and acceptable answer** | Continue, or escalate per (b) |

- **TST-6a-07 [B]** The log entry must say, so it is actionable rather than an epitaph:
  - which scenario and script, and which requirement is left unverified
  - what was observed, concretely, and what was expected
  - whether the fault is believed to be the application's, the script's, or genuinely
    undetermined — and **"undetermined" is an acceptable and useful answer**
  - what would settle it: a fixture, a tool, a requirements decision, a different observation
    point
- **TST-6a-08 [B]** The **Orchestrator writes the entry** and names it in `test_results_N.md`, so
  the Reviewer sees what was left unverified.
- **TST-6a-09 [B]** **This is not permission to abandon a test that merely failed once**, and it is
  not permission to weaken an assertion — `TST-5-02` still binds absolutely. It is permission to
  stop *investigating* and record honestly what is unverified. An unverified requirement recorded
  plainly is far more useful than a green suite that was made green by attrition.

## 7. Verdict Vocabulary

- **TST-7-01 [B]** Every `review_N.md` opens with exactly one test verdict, given by the Reviewer
  from the saved output:

| Verdict | Meaning | Routes to | Consumes a defect cycle |
|---|---|---|---|
| `PASS` | The tests are sound, cover the requirements in scope, and ran clean against the committed expectation | Gate 2, if no Medium or High finding | — |
| `FAIL_DEFECT` | The tests are sound; the application is wrong | Orchestrator | **Yes** |
| `TESTABILITY_BLOCKED` | No reliable script can be written against this UI as built, or the authoring budget is exhausted | Orchestrator | No |
| `FAIL_SPEC` | The requirement is ambiguous or self-contradictory | Human Overseer | No |

- **TST-7-02 [B]** `TESTABILITY_BLOCKED` is the expected outcome when a UI element has no stable
  identifier to target. Adding the identifier is a legitimate task for the Orchestrator, not a
  test failure, and it must not burn a defect cycle.
- **TST-7-03 [B]** `N` in the filename increments on **defect cycles only**.
- **TST-7-04 [B]** `test_results_N.md`, written by the Orchestrator before the review, records the
  run: the scripts run with their exact commands and exit codes, the raw output folder, any
  declared expected-value change (`TST-5-02`), and the authoring attempts, in a short section at
  the top:

```markdown
## Stabilisation
Stabilised after 3 attempts.
- Attempt 1: table rows not yet rendered — added explicit wait on table load.
- Attempt 2: wrong element id (`user-table` vs `user_table`) — corrected.
- Attempt 3: passed.
No assertions were changed.
```

## 8. `test_scenarios.md` Format

- **TST-8-01 [B]** A single cumulative table, not one per task, with these columns:

| Column | Content |
|---|---|
| Test No | Sequential, permanent, never reused |
| Test Scenario | What is verified, in plain language, with the expected result |
| Req No | The `REQ-nnn` this verifies |
| Test Script | The `.py` filename |
| Status | `ACTIVE`, `DONE`, `CANCELED` |
| Status Date | `YYYY-MM-DD` of the last status change |
| Notes | Anything a later reader needs |

## 9. Execution — the Orchestrator Writes and Runs, the Reviewer Judges

**The Reviewer has no shell.** This is by design. See `notes_for_agents.md` §5.

- **TST-9-01 [B]** **The Reviewer does not try to run anything, and does not treat the absence of a
  shell as a blocker to report** — this is the designed workflow, not a fault. What it needs run,
  it requests in one batch (`WFL-3-07`).
- **TST-9-02 [B]** Follow this sequence:

| Step | Actor |
|---|---|
| 1. Commit the scenario and expected result to `test_scenarios.md` | Orchestrator |
| 2. Write `py/test<no>_<title>.py` | Orchestrator |
| 3. Run it; fix the script while it misbehaves, within three attempts (§6a) | Orchestrator |
| 4. Run every applicable script once more on the finished work; save **raw stdout, stderr and exit codes** in `run<N>_raw_output/` | Orchestrator |
| 5. Write `test_results_N.md` (`TST-7-04`) | Orchestrator |
| 6. Check the tests against the requirements, read the saved output, give the verdict | Reviewer |
| 7. Run anything the Reviewer requested, exactly as given; save the output; return it verbatim | Orchestrator |

- **TST-9-03 [B]** **The Orchestrator does not give the verdict on its own work.** It records the
  run; whether it counts as passing stays with the Reviewer, which did not write the work or the
  tests. When returning requested output, it relays it verbatim and does not interpret it.
- **TST-9-04** RETIRED 2026-10-30 — "The Tester still never fixes application code." The author of the
  tests now also fixes the work; independence comes from the Reviewer (`TST-9-03`, `TST-9-10`).

### Consequence for the authoring budget

- **TST-9-05 [A]** §6's three attempts are fast local runs by the Orchestrator, but the cap still
  stands. Prefer a script that prints enough diagnostic detail on failure to tell *why* in one
  run; the Reviewer reads the same output and has no way to ask the script anything.

### Writing scripts another agent judges

- **TST-9-06 [B]** Make the script self-contained and runnable with one command, no arguments, no
  interactive prompts. `python -m pytest` or plain `python path\to\script.py`.
- **TST-9-07 [B]** Print a clear `PASS` / `FAIL` line per assertion plus the actual value seen, so
  one run tells the Reviewer everything.
- **TST-9-08 [B]** Never assume a value — print it. A script that asserts silently gives the
  Reviewer nothing to judge.
- **TST-9-09 [B]** State the exact command for each script in `test_results_N.md` — absolute
  paths, no placeholders, and any `PYTHONPATH` requirement — so the Reviewer can request a re-run
  by it.
- **TST-9-10 [B]** **The Reviewer checks the tests themselves, not only their result:** every
  requirement in scope has a test; every expected result follows from the requirement, not from
  what the application happens to do; any change to an expected result was declared
  (`TST-5-02`); the saved output agrees with `test_results_N.md`. Where a test is missing, it
  describes the scenario and its expected result in words (`PRJ-1.1-07`). It never fixes anything.

## 10. Running the Application

- **TST-10-01 [B]** **The Orchestrator owns the application process.** The Reviewer never starts
  or stops it.

The reason is lifecycle: a subagent's dispatch ends when it returns, and a server it launched in
the background outlives it as an orphan holding the application's port. The Orchestrator persists
across the whole task, so it is the only actor that can reliably start and stop.

- **TST-10-02 [B]** **Sequence:**
  1. After making a change, the Orchestrator restarts the application so the test run sees the
     new code.
  2. It waits for the app to answer, then runs the tests.
  3. After the run, it stops the process, unless the Overseer is to look at the running app at
     Gate 2.
- **TST-10-03 [B]** **Facts every run uses, recorded in `notes_for_agents.md`:**

| Item | Value |
|---|---|
| URL | not applicable yet (no app) |
| Interpreter | not applicable yet (no conda environment; see `notes_for_agents.md` Â§0) |
| Launch | not applicable yet (no app) |
| Startup time | Not applicable yet (no app). |

- **TST-10-04 [B]** An error from a probe made within the startup time of launch is not a defect
  and must not be reported as `FAIL_DEFECT`.
- **TST-10-05 [B]** **If the application wedges during a run**, the Orchestrator restarts it and
  runs again; the attempt is authoring, not a defect cycle. A run that cannot be completed is
  recorded in `test_results_N.md`, and the Reviewer returns `TESTABILITY_BLOCKED`.

## 11. Database Access in Tests

*Applies when tests can reach a real database. Delete §11 and §11a (marking the codes
`RETIRED`) if the project has none.*

- **TST-11-01 [B]** **Connect as not applicable yet (no database).** It has read access to everything a test
  needs to verify, and nothing more.
- **TST-11-02 [B]** **Never connect as any of not applicable yet (no database).** Those credentials may be
  on the machine and carry write access; a stray `UPDATE` against a live or shared database hits
  real records.
- **TST-11-03 [B]** **No direct writes.** No `INSERT`, `UPDATE` or `DELETE` from a script or
  query, and no calling a mutating database function directly, regardless of role.

### 11a. Writing Data Through the Application Is Permitted

- **TST-11a-01 [B]** Agents **may create and change data by using the application itself**:
  logging in and pressing the application's own controls, such as **Save**, **Create**,
  **Activate / Deactivate** or **Assign**. This is allowed for any control that was built to
  satisfy a requirement in `requirements.md`. A write made this way goes through the
  application's own validation, audit parameters and transaction handling, exactly as a user's
  would. That is what makes it safe, and it is the only reason it is allowed.

The boundaries:

- **TST-11a-02 [B]** **Only through the application's UI.** In practice that means a browser
  automation script that clicks the control, run by the Orchestrator. Not a forged HTTP request,
  not SQL, and not a direct function call. The direct-write ban (`TST-11-03`) still holds.
- **TST-11a-03 [B]** **Only controls that exist because a requirement asked for them.** Anything
  else is not a sanctioned write path.
- **TST-11a-04 [B]** **Commit the scenario first (`TST-4-01`),** and state in it exactly what the
  run creates or changes. Record what was written in `test_results_N.md`.
- **TST-11a-05 [B]** **Leave things as you found them where the application allows.** If it
  offers the inverse action, such as untick, deactivate or remove, use it at the end of the run.
  Audit-trail rows are permanent and are expected.
- **TST-11a-06 [A]** **Prefer test fixtures that belong to this project, and records the test
  created itself.**
- **TST-11a-07 [B]** Do not alter existing real records unless the scenario cannot be tested any
  other way, and then say so in the scenario.
- **TST-11a-08 [B]** If the application can create the data a test needs, create it through the
  application. Return `TESTABILITY_BLOCKED` only when it cannot.
- **TST-11a-09 [B]** Do not borrow another product's or another team's test accounts or
  fixtures, even when they are reachable.
- **TST-11a-10 [B]** **One exception to `TST-11a-02`: refusal probes.** To prove a **server-side**
  safety check works when the UI can never produce the bad request, a script may send a hand-built
  request, or alter a real one in flight. All of the following must hold:
  1. The request is **designed to be refused or rolled back**. Its purpose is to prove the
     refusal, never to store data.
  2. It targets **this project's own test records only**.
  3. The scenario states up front exactly what is sent and the refusal expected (`TST-4-01`).
  4. The script checks afterwards that nothing was left behind. If the safeguard failed and
     something was written, it prints `UNDO NEEDED`, and the Orchestrator stops the run and
     reports it.

  A request meant to **store** data must still go through the UI (`TST-11a-02`).
