# Review N — <task name>

*Template. The Reviewer cannot write files: it returns this report in `report_markdown`; the
Orchestrator writes it here **verbatim**, not paraphrased
(`PRJ-1.1-05`). Rename to `review_<N>.md`; the report of a re-dispatch after a request
round in the same cycle is `review_<N>_r2.md` and holds the cycle's final verdict (`WFL-3-07`).
Delete the italic guidance.*

Date: YYYY-MM-DD
Cycle: N of 2
Diff reviewed: *file in the task folder, e.g. `diff_for_review.txt`, and its baseline (commit or
`code_snapshot_<date>_<label>/`)*
Judged against: `plan.md` | `request.md` *(no plan, `WFL-4-02`)*

## Test Verdict

**PASS | FAIL_DEFECT | TESTABILITY_BLOCKED | FAIL_SPEC** *(exactly one — `TST-7-01`)* — *one line
why, from the saved output in `run<N>_raw_output/`.*

## Review Verdict

ACCEPT | FINDINGS

## Findings

*One block per finding. Severity per `agent_reviewer.md`: a [B] rule violation is at least
Medium, an [A] at most Minor. A finding that cites neither a rule code nor a plan item /
requirement is a preference, not a finding.*

### [HIGH|MEDIUM|MINOR] <short title>
File: path:line
What: the defect.
Why it matters: the consequence.
Rule: the rule code (e.g. COD-6-01), or the plan task item / REQ-nnn where no rule applies.

## Missing Tests

*Scenario and expected result in words; the Orchestrator writes the test (`PRJ-1.1-07`,
`TST-9-10`). Or "none".*

## Requests (`WFL-3-07`)

*Command, reason, expected result — all in this one round. Or "none".*

## Plan / Request Coverage

| Item | Status |
|---|---|
| 1 | done / not done |

## Requirements Coverage

| Requirement | Status |
|---|---|
| REQ-nnn | implemented and tested / gap |

## Test Audit

*Every requirement has a test; expected results follow from the requirement; scenarios committed
before the first run (`TST-4-01`); every assertion change declared (`TST-5-02`); naming
(`TST-2-01`); helpers catalogued and not duplicated (`TST-3-02`); saved output agrees with
`test_results_N.md`.*

## Not Verified

*What could not be checked, and why — or "nothing".*

## Deferred to Defect Log

*Minor items with a one-line rationale each, or "none". The Orchestrator assigns DEF numbers.*
