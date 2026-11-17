# Test Function Catalogue — AI_Claude_Tools

Every reusable helper in `py/util_*.py`, so that a later session — which starts with no
memory of any previous one — reuses what exists instead of writing a second function that does
the same thing.

**Read this before writing any helper** (`TST-3-01`). Maintained by the Orchestrator.

Helpers are grouped by area of use and named `util_<area_of_use>.py`. Test scripts themselves
are named `test<no>_<test_title>.py` and are *not* catalogued here — they are listed in
`test_scenarios.md`.

Reuse applies to helpers only. Do not split or merge test scripts in pursuit of reuse; one
scenario maps to one script so requirements and tests stay traceable.

---

## util_db.py

*Read-only verification queries. Connects as not applicable yet (no database) only.*

| Function | Signature | Purpose |
|---|---|---|

## util_web.py

*HTTP-level helpers: credentials by key (never by value), sign-in, reading responses.*

| Function | Signature | Purpose |
|---|---|---|

## util_browser.py

*Browser automation helpers: launching the browser, waiting for page state, reading what is
drawn on screen.*

| Function | Signature | Purpose |
|---|---|---|

## util_file.py

*File and output helpers: writing run output to the explicit folder named in the brief.*

| Function | Signature | Purpose |
|---|---|---|
