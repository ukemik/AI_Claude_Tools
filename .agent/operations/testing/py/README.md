# py/ — Test Scripts and Shared Helpers

Written and run by the Orchestrator; the output is judged by the Reviewer (`rules_testing.md` §9).

## Naming (`TST-2-01`, `TST-2-02`)

| Artifact | Format | Example |
|---|---|---|
| Test script | `test<no>_<test_title>.py` — `<no>` is the Test No in `test_scenarios.md`, zero-padded to three digits | `test007_login_rejects_inactive_user.py` |
| Shared helper module | `util_<area_of_use>.py` | `util_db.py`, `util_web.py`, `util_browser.py`, `util_file.py` |

One scenario, one script (`TST-3-03`). Every helper is catalogued in `../test_functions.md`
before another dispatch can be expected to reuse it.

## How every script must behave (`TST-9-06` to `TST-9-09`)

- Runs with one command, no arguments, no prompts: `powershell -NoProfile -File` or `node` + `.agent\operations\testing\py\test<no>_<title>.<ext>` (no Python interpreter set yet)
  with the project root on `PYTHONPATH`.
- Prints one `PASS` / `FAIL` line per assertion **with the actual value seen**, and a final
  `RESULT:` line. Exit code 0 on pass, non-zero on failure (and a distinct code for "all
  skipped", if the project uses skips — record it in `notes_for_agents.md`).
- Never contains a password or secret (`COD-14-01`); credentials come from environment variables
  through a helper.
- Database checks connect as not applicable yet (no database) only (`TST-11-01`).
- Writes output files (screenshots, dumps) only to an explicit absolute folder the brief names —
  normally the task folder — never to the current directory.
- Prints `UNDO NEEDED` only when a refusal probe's safeguard actually failed (`TST-11a-10`).
