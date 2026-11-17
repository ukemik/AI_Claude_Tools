---
description: Capture the diff, dispatch the reviewer-tester for the verdict and findings, and route them.
argument-hint: [task folder name]
---

Run the review step for: **$ARGUMENTS** (if blank, the in-flight task in `task_status.md`).

Acting as Orchestrator, follow `.agent/team/agent_orchestrator.md` §2 "Hand over" and §4:

1. `N` = the next `review_N.md` number; `test_results_N.md` and `run<N>_raw_output/` must exist.
2. Save the diff against the right baseline, plus untracked files, as `diff_for_review.txt`.
3. Dispatch the **reviewer** subagent with one self-contained brief (`WFL-3-05`). Write its report
   verbatim to `review_N.md`.
4. If it returned requests, run them exactly as given and re-dispatch once → `review_N_r2.md`.
5. Route the verdict (`WFL-6-04`, WFL §7). If this would be defect cycle 3, escalate to me.
6. Show me the report and stop at **Gate 2**.
