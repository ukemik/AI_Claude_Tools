# Coding Rules — AI_Claude_Tools

Binding on every agent that writes code. The Reviewer audits each diff against this document.

## How to Use This File

- **Every rule has a code** of the form `COD-<section>-<NN>`, for example `COD-6-01` (§6, first
  rule) or `COD-11.4-02`. Cite the code in plans, handoffs, findings and defect entries. Codes are
  permanent — never renumbered, never reused — so a citation stays valid even if a rule's text
  moves. The full scheme and the prefixes of the other rules files are in
  `rules_documentation.md` §11.
- **Every rule has a severity tag**, mapped onto the Reviewer's scale (`agent_reviewer.md`):
  - **[B] Blocking.** A violation is at least **Medium**, so it is fixed in the task.
  - **[A] Advisory.** A violation is at most **Minor**. It is noted and never by itself grounds
    to reject.
- Rules apply to **new or modified code only**. A style preference that no rule covers is not a
  finding.
- **Reserved codes.** A line marked *(reserved)* holds a code whose rule is stack- or
  project-specific and is not part of this generic file. The code is never reused for a different
  rule. Rules for your own stack go in a separate file with its own prefix — see the package's
  `examples/rules_coding_stack_example.md` and `rules_documentation.md` §11.
- **History.** These rules were adopted for this project on 2026-11-17. Tasks are reviewed
  against the rules in force at their Gate 1. Record any later change here with its date.
- The examples are written for Python. For another language, keep the intent and adapt the
  examples (type annotations, logging calls, compile check).

---

## 1. Scope Lock (CRITICAL)

- **COD-1-01 [B]** **Under no condition may any agent create, modify or delete any file outside
  the active project folder `AI_Claude_Tools/` or its sub-folders.** This applies to every role,
  including the Orchestrator, and to **every tool** — `Write`, `Edit`, and shell commands alike
  (redirection, copy, move, delete, installers, scripts that write files). It includes every
  read-only path listed below. Temporary files go only to the session scratchpad provided by the
  harness or to a temporary folder inside `AI_Claude_Tools/`, never to a system or user temp
  folder outside it. **There is no approval path:** this is not a hard stop that the Human
  Overseer can wave through for an agent. If a change outside the project is needed, the agent
  describes it and the Human Overseer makes it themselves.
- **COD-1-02 [B]** A new database function, procedure or migration is written **by the Orchestrator** (`PRJ-1.1-07`) to
  `.agent/operations/development/sql/`, in a file named after its target file in
  not applicable yet (no database). The Human Overseer moves it and creates it in the database.
- **COD-1-03 [A]** Prefer an existing database function in not applicable yet (no database) over writing a new
  one.
- **COD-1-04 [B]** *(Human Overseer, 2026-11-11)* **Every database activity goes through a
  database function or procedure.** Every read, write or other operation the application
  performs on the database is done by a function or procedure in the database, in the schema
  that matches its purpose (`COD-20-02`). The application-side code (Python, Rust, … — the
  frontend or the orchestration layer) holds, for each one, exactly one caller in
  not applicable yet (no database), named **`call_<database function name>`**: the function's or procedure's own
  name, without the schema (`check_identity` → `call_check_identity`). The caller holds no
  business logic: it binds the parameters, runs the function or procedure and returns its result,
  and besides that only checks the audit context (`COD-7-01`) and rolls back on exception
  (`COD-6-02`); it never commits (`COD-6-01`). No inline `SELECT`, `INSERT`, `UPDATE` or
  `DELETE`, and no ORM query, in new application code. Read-only inspection and verification
  queries by agents and test scripts (`COD-1-05`, `COD-11.4-01`, `TST-11-01`) are not
  covered by this rule. A task with no function to call needs a new one: a hard stop
  (`COD-12-04`), staged under `COD-1-02` and created by the Human Overseer (`COD-1-05`).
- **COD-1-05 [B]** **Agents never create, alter or drop anything in the database.** A new or
  changed database object is written to the `.sql` file under `COD-1-02`; a one-time command for
  the Overseer to run in the database (a data fix, a grant, a verification query) is written to
  the sql sub-folder of `.agent/temp/` by the Orchestrator (`PRJ-4a-01`, `PRJ-4a-05`). In both
  cases
  the Orchestrator **prints its complete SQL in the chat** for the Human Overseer to review and
  create or run themselves.
  No agent runs `CREATE`, `CREATE OR REPLACE`, `ALTER` or `DROP` against any database, by any
  route. The work that depends on the object waits until the Overseer confirms it exists. The
  Orchestrator then verifies it read-only as not applicable yet (no database).

Agents **may read** these paths, and never write to them:

| Path | Read it for |
|---|---|
| `C:\Users\ukemiktarak\.claude` | The installed copies of the hooks, mods and packages: to compare with the source or check an install. Never edited — the Overseer reinstalls |
| `../AI_Packages` | The ai_dev_package and ai_metrics_package sources that hooks here check for or call |

## 2. File Responsibility Map

- **COD-2-01 [B]** Code goes in the file this map assigns to its concern.

| File | Responsibility |
|---|---|
| Controller layer: not applicable yet (no app) | Frontend-to-backend orchestration (callbacks, request handlers). The **only** place a transaction is committed. |
| Data layer: not applicable yet (no database) | Database interaction and query execution. Fetches and rolls back; never commits. |
| UI wrapper file: not applicable yet (no UI) | UI components — buttons, forms, list items, page skeletons, and the centralised wrappers (§5). |
| Config folder: not applicable yet | Configuration: branding, theme, authentication settings, connection parameters. |
| `Claude_Hooks/` | Claude Code hooks: `sound-hooks.json`, `project-checks/` (`run-checks.ps1`, one `checks/<name>.ps1` per check, `VERSION`), `user-claude-md.md`, and `install.ps1`, which installs them into `~/.claude`. |
| `Claude_Mods/<mod>/` | One Claude Code mod each: `.claude-plugin/plugin.json` (name, version), `hooks/hooks.json`, `hooks/register.ts` (the mod), `hooks/register.test.ts` (its tests). |
| `Claude_Mods/prompt-pad/vscode-extension/` | The VS Code extension Prompt Pad Sender: `package.json` (commands, key bindings, version), `extension.js`, `block.js`, `completion.js`, their `*.test.js`, `build.ps1`. |
| `Claude_Mods/.claude-plugin/marketplace.json`, `Claude_Mods/install.ps1` | The `claude-mods` marketplace and the script that installs every mod and the extension. |
| `README.txt` files | One per folder: what it holds, how to install, check and remove it. Updated in the same change as the code (`COD-3-07`). |
| `.agent/operations/testing/py/` | Test scripts, shared helpers, testing configuration. |
| `.agent/temp/<type>/` | Code and other files exchanged with the Human Overseer, for them to check or run (`PRJ-4a-01`). Never the home of a project file (`PRJ-4a-04`). |

## 3. Function Declarations, Type Hints and Documentation

### Type hints

- **COD-3-01 [B]** Every new or modified function has complete parameter **and return** type
  hints.
- **COD-3-02 [A]** Avoid `Any`. If it is unavoidable, add a comment saying why.
- **COD-3-03 [A]** Use built-in generics (`list[str]`) and `X | None`.

### Docstrings and comments

- **COD-3-04 [B]** Every new or modified function carries a docstring.
- **COD-3-05 [B]** The docstring has these sections:
  - **Description** — the function's purpose and logic.
  - **Parameters** — every parameter and its role.
  - **Return Values** — return type and meaning.
  - **Notes** — critical prerequisites or example usage. Only where strictly necessary; do not
    crowd with detail that adds nothing.
- **COD-3-06 [A]** New comments explain *why*, not *what*. Existing comments are left alone
  (`COD-12-03`).
- **COD-3-07 [B]** When setup, configuration or user-visible behaviour changes, update
  `system_design.md` and `user_manual.md` in the same change (`DOC-1-02`).

## 4. Logging

- **COD-4-01 [B]** Never use `print()` in application code. Use the project's logging facility,
  not applicable yet (scripts write to the console; no logging facility).
- **COD-4-02 [B]** Never include the function name in a log message when the logging formatter
  already records it.
- **COD-4-03 [B]** Use the level the situation calls for:

| Situation | Call |
|---|---|
| Critical logic error, configuration problem, or workflow failure surfaced to the user as an error (e.g. "Account is inactive", "Missing username") — **even when handled gracefully** by returning a failure to the UI rather than raising | `logger.error("...")` |
| Non-critical issue where the system safely recovers or substitutes a default without interrupting the user's workflow | `logger.warning("...")` |
| Inside an `except` block | `logger.exception("...")` followed by a bare `raise` — see `COD-4-04` |

- **COD-4-04 [B]** Inside an `except` block, log with `logger.exception` and re-raise with a bare
  `raise`, without duplicating the message already logged. **One exception: a user-facing
  boundary** — a save or other user-triggered handler that reports its outcome to the user — rolls
  back, logs with a reference code the user can quote, and **returns** a failure notification
  rather than re-raising, because a re-raised exception can never reach the screen and would leave
  stale results with no message. Everything else logs and re-raises.
- **COD-4-05 [B]** Never log passwords, password hashes, tokens or session secrets. Usernames and
  ids may be logged where the audit trail (§7) needs them.

## 5. UI Standardisation

- **COD-5-01 [B]** Build UI elements through the centralised wrappers in not applicable yet (no UI)
  wherever a wrapper exists for the element. List them here:

| Element | Must use |
|---|---|
| Not applicable yet (no UI) | — |

- **COD-5-02 [A]** Avoid bypassing the component library with raw markup unless strictly
  necessary.

## 6. Transaction Management

- **COD-6-01 [B]** A transaction is committed only in not applicable yet (no app), never in
  not applicable yet (no database).
- **COD-6-02 [B]** The data layer issues rollbacks on exception only.
- **COD-6-03 [B]** Related mutations are wrapped in a single `try/except`, so they commit
  atomically or roll back together.

## 7. Audit Enforcement (CRITICAL where the project keeps an audit trail)

- **COD-7-01 [B]** The acting user's identity (and any other context the audit trail records) is
  mandatory for every database mutation. The data layer raises `ValueError` and fails the
  transaction if any part is missing.
- **COD-7-02** *(reserved — stack-specific: how the audit context is set on the database
  transaction; see the package's `examples/rules_coding_stack_example.md` STK-7-01)*

## 8. Context Variables

- **COD-8-01 [B]** Where the code carries two identifiers of the same kind with different jobs —
  for example "this application" versus "the record or tenant being managed" — list them in this
  table and use each only for its own job. Using the wrong one silently scopes data to the wrong
  owner and raises no error. The Reviewer checks every data call for this.

| Variable | Meaning | Used for |
|---|---|---|
| *(none yet)* | | |

## 9. Functional Grouping

- **COD-9-01 [A]** Functions belonging to the same screen or feature — layouts, handlers, data
  definitions — are grouped together, with a comment title before the first function of the
  group:

```python
# --- User Management Tab Layouts ---
```

## 10. Error Handling

- **COD-10-01 [B]** No bare `except:`. `except Exception` only when re-raising, as `COD-4-04`'s
  `logger.exception` plus bare `raise` pattern does, or at a boundary such as a UI callback or
  request handler.
- **COD-10-02 [B]** Never swallow an exception silently (`except ...: pass`). Log it, handle it,
  or re-raise it.
- **COD-10-03 [A]** Catch the most specific exception type that fits.
- **COD-10-04 [B]** Wrap database and I/O work in `try/except`, and log per §4 before re-raising.

---

## 11. Project-Specific Patterns

> **This is the only section whose content depends on the project.** §11.1 applies only if the
> project designates a reference implementation; §11.4 applies only if the project has a shared
> or live database. Delete what does not apply and mark the deleted codes `RETIRED <date>`
> (`DOC-11-07`). Rules for a particular technology stack belong in their own file, not here.

### 11.1 Copy from the Reference Implementation, Do Not Rewrite

*Applies when `none` is set.*

- **COD-11.1-01 [B]** Where `none` already implements a piece of functionality,
  **copy its code and adapt it** rather than writing an equivalent from scratch. This applies to
  layouts, handlers, data functions and notification patterns. Reinventing a working feature
  costs review cycles and produces gratuitous divergence from a product the users already know.
- **COD-11.1-02 [B]** When copying, make the adaptations listed here, and only these:

| The reference does | Here you must |
|---|---|
| *(e.g. resolves context internally)* | *(e.g. take it as an explicit parameter)* |

- **COD-11.1-03 [B]** Do not change component structure, wrapper usage, styling or layout of
  copied code unless a requirement says so. Parity with the reference is then a requirement, not a
  preference.
- **COD-11.1-04 [B]** Cite the reference source file and line range in the plan and in the
  handoff, so the Reviewer can diff against the original.

### 11.2 *(reserved — stack-specific theme rules; see the package's `examples/rules_coding_stack_example.md` §11.2)*

- **COD-11.2-01** to **COD-11.2-04** *(reserved)*

### 11.3 *(reserved — project-specific rules on where a context identifier is read from; the generic principle survives as `COD-8-01` and `COD-17-04`)*

- **COD-11.3-01** to **COD-11.3-04** *(reserved)*

### 11.4 Database Access for Agents

*Applies when agents can reach a real database.*

- **COD-11.4-01 [B]** Agents connect as **not applicable yet (no database)**, a read-only role, never as
  any of not applicable yet (no database). A live or shared database written to directly by an agent damages
  real data.
- **COD-11.4-02 [B]** **The one sanctioned write path is the application itself.** Agents may log
  in and use the application's own requirement-built controls, such as Save, Create and
  Activate / Deactivate, to create or change data. Direct SQL writes remain forbidden. Boundaries
  in `rules_testing.md` §11a (`TST-11a-01` onward).

## 12. Agent Behaviour and Scope

These govern how agents work rather than the shape of the code.

- **COD-12-01 [B]** **Plan first, where a plan is required.** No source file is modified before
  an approved `plan.md` exists for a task that needs one (`WFL-4-02`). Every task, with or without
  a plan, has a `request.md`.
- **COD-12-02 [B]** **Minimal intervention.** Change only what the task requires. Do not
  refactor, rename or reformat unrelated code.
- **COD-12-03 [B]** **Never alter existing docstrings, comments or code blocks that are
  irrelevant to the task** — unless they are functionally incorrect.
- **COD-12-04 [B]** **Hard stops.** A new or changed dependency, a database schema change, a new
  database function, or a change to an existing class `__init__` requires the Human Overseer's
  approval before proceeding. A change to a file outside the project is **not** a hard stop — it
  is forbidden outright, with no approval path (`COD-1-01`).
- **COD-12-05 [B]** Do not change a function signature or other public interface the plan
  defines without raising it with the Human Overseer.

---

## 13. Readability

- **COD-13-01 [B]** Use descriptive names. Single letters only for loop indices, comprehensions
  and conventional maths variables.
- **COD-13-02 [B]** No commented-out code in new code. Exception: a verbatim copy of a reference
  file under `COD-11.1-01`.
- **COD-13-03 [A]** Maximum nesting depth of 4. Flatten with early returns or helpers.
- **COD-13-04 [A]** A function does one thing. Soft limit of about 40 lines.
- **COD-13-05 [A]** Avoid boolean parameters that switch behaviour. Prefer two functions or an
  enum.

## 14. Security

- **COD-14-01 [B]** No hardcoded secrets, tokens, passwords or keys, in application code or test
  scripts. Load them from environment variables or a secrets store.
- **COD-14-02 [B]** No `eval`, `exec` or `pickle.load` on data that is not fully trusted.
- **COD-14-03 [B]** SQL uses bound parameters or the ORM. Never build SQL with string formatting
  from external values.
- **COD-14-04 [B]** No `subprocess` with `shell=True` when any part of the command comes from
  external input.
- **COD-14-05 [A]** Validate external input (form fields, files, environment variables) where it
  enters the system.
- **COD-14-06 [A]** Guard file paths built from external input against traversal (`..`).
- **COD-14-07 [A]** Use `secrets`, not `random`, for anything security-related.

Never logging secrets is a security rule too; it lives in §4 as `COD-4-05`.

## 15. Reuse and Design

- **COD-15-01 [B]** Before writing a helper, search this project and `C:\Users\ukemiktarak\.claude` (the installed copies) and `../AI_Packages` for one
  that already does the job.
- **COD-15-02 [A]** Extract shared logic when it appears a third time. Two similar blocks are
  acceptable.
- **COD-15-03 [B]** No abstraction layers, base classes, plugin systems or configuration options
  the task does not require.
- **COD-15-04 [A]** Prefer composition and plain functions over inheritance.

## 16. Performance

- **COD-16-01 [B]** No queries, network calls or file I/O inside a loop when a batch operation is
  possible (no N+1).
- **COD-16-02 [B]** Use `with` for files, locks and connections the code opens itself. A
  framework-managed, request-scoped database session is governed by §6 instead.
- **COD-16-03 [A]** Use sets or dicts for repeated membership tests on non-trivial collections.
- **COD-16-04 [A]** Stream large files and datasets rather than loading them whole.
- **COD-16-05 [A]** Do not recompute an expensive result that can be computed once.
- **COD-16-06 [A]** Do not optimise beyond these rules unless the plan states a measured
  performance requirement.

## 17. Testability

- **COD-17-01 [A]** Keep pure logic apart from I/O (database, filesystem, network, time) so it can
  be tested without mocks.
- **COD-17-02 [A]** Pass dependencies in rather than creating them inside a function. Changing an
  existing `__init__` to achieve this is still a hard stop (`COD-12-04`).
- **COD-17-03 [B]** No import-time side effects such as network calls, file writes or database
  connections in new modules. Exception: the application entry point and any startup lookups a
  requirement explicitly asks for.
- **COD-17-04 [A]** Avoid global mutable state. Per-session or per-user state belongs in the
  session store, never in a module-level variable shared by every concurrent user.

## 18. Dependencies

Adding or changing a dependency is a hard stop (`COD-12-04`). These govern how an approved
addition is made.

- **COD-18-01 [B]** Declare every dependency in not applicable yet (no environment file), pinned.
- **COD-18-02 [A]** Prefer the standard library when it does the job reasonably well.
- **COD-18-03 [A]** Prefer widely used, actively maintained packages.
- **COD-18-04 [B]** The project runs in its own **conda environment**, not applicable yet (no conda environment)
  (path not applicable yet (no conda environment), Python not applicable yet (no conda environment)). Every agent and every command uses
  this environment's interpreter, not applicable yet (no conda environment; see `notes_for_agents.md` Â§0), by its absolute path — never the system
  Python, `base`, another project's environment, or a `venv`. Do not rely on `conda activate`
  in a shell an agent opens; call the interpreter directly.
- **COD-18-05 [B]** not applicable yet (no environment file) is the conda environment file and the single source
  of truth for the environment. It is kept **continuously up to date**: any approved change to the
  environment (a package added, removed or re-pinned, conda or pip section alike) updates
  not applicable yet (no environment file) in the **same change**, and the plan's Affected Files lists it. A
  package installed into the environment but missing from the file is a defect. The file must be
  able to rebuild the environment from scratch:
  `conda env create -f not applicable yet (no environment file)` (new) or
  `conda env update -f not applicable yet (no environment file) --prune` (existing).
- **COD-18-06 [B]** Agents never install, upgrade or remove packages themselves. The Orchestrator
  edits not applicable yet (no environment file) as part of an approved hard stop (`COD-12-04`); the Human
  Overseer (or the Orchestrator, when the Overseer says so) runs the `conda env update` command.
- **COD-18-07 [A]** When the Orchestrator finds the environment and the file disagree (e.g.
  `conda list` shows a package the file does not), it logs a defect and tells the Overseer; it
  does not silently fix either side.

## 19. Configuration

- **COD-19-01 [A]** No unexplained literals. Use named constants or configuration. Values copied
  verbatim from a reference implementation under `COD-11.1-01` are exempt.
- **COD-19-02 [A]** Environment-specific values (URLs, paths, timeouts) come from
  not applicable yet (no app), not from code.
- **COD-19-03 [A]** Configuration is defined in not applicable yet (no app) and imported from there, not read
  ad hoc.

- **COD-19-04 [B]** *(Human Overseer, 2026-10-23)* Every environment variable, user or system,
  that the application, its scripts or its deployment needs is documented **in the same change**
  in every related document, so that it is not missed when the code is deployed to another
  environment, production included. This applies when a variable is added, renamed or removed,
  or when its meaning changes. The related documents are `system_design.md` (its "Environment
  Variables" section, created if missing) and every installation, deployment and IQ
  (Installation Qualification) document the project keeps. Each entry gives the name, the scope
  (user or system), what reads it, whether it is required or optional, what happens when it is
  missing, and an example value. Never give a real secret or password. A related document that
  does not exist yet is tracked by the Orchestrator as open until it is written (`DOC-7-01`).
  **Shared variables** *(Human Overseer, 2026-10-25)*: a variable that another application in
  the same ecosystem already reads, under the same name, is installed by that application. This
  project's installation document does not list it again. It names the owning application's
  installation as a prerequisite, and `system_design.md` lists the variable as used, with its
  owner.
- **COD-19-05 [B]** *(Human Overseer, 2026-10-23)* The task's `plan.md`, or its `request.md`
  where there is no plan, lists every environment variable the task adds, renames, removes or
  changes, with the documents `COD-19-04` requires. If there are none, it says "None".

## 20. Database First and Schema Layout

Applies to every project with a database. Database objects are still created only by the Human
Overseer (`COD-1-05`); these rules govern *when* they are designed and *where* they live.
`<prefix>` is the application's short prefix (for example `crm` gives `crm_system`). Not set yet:
this project has no database.

- **COD-20-01 [B]** **Database first.** Once the Human Overseer agrees the initial requirements,
  development starts with the database objects (schemas, tables, constraints, functions,
  triggers, roles and grants), before any application code. The first task after the initial
  requirements is a database task: the Orchestrator plans the objects, the SQL is staged under
  `COD-1-02`, and the Overseer creates them. Application tasks that need them start only after the
  Orchestrator has verified them read-only.
- **COD-20-02 [B]** **Schemas by functionality.** Database objects are divided into schemas by
  what they do:

  | Schema | Holds |
  |---|---|
  | `<prefix>_system` | Objects related to how the system works (applications, users, roles, permissions, settings, audit trail, logging). |
  | `<prefix>_frontend` | Objects related to the frontend user interface (functions and views the UI calls, UI configuration). |
  | `<prefix>_data` | Tables and objects for the data the application collects. |
  | `<prefix>_analytics` | Objects behind graphs, charts and dashboards (reporting views, aggregates, materialised views). |
  | `<prefix>_scheduler` | Objects for the regular jobs that run in the backend (job setup, run history, heartbeat). |
  | `<prefix>_api` | Objects for API functionality that shares data with, or imports data from, the outside world. |

- **COD-20-03 [B]** Every new database object is placed in the schema that matches its function
  under `COD-20-02`, and the plan names the schema for each object. An object that seems to fit
  two schemas goes where its **main purpose** is; the plan says why. A new schema outside this
  list is a hard stop (`COD-12-04`).
- **COD-20-04 [A]** A schema the project does not need yet is not created early. When it is first
  needed, its creation is part of that task's staged SQL.
- **COD-20-05 [B]** **Agents write the scripts; the Human Overseer applies them.** Agents have
  **read-only** access to the database (not applicable yet (no database), `COD-11.4-01`) to inspect and
  verify objects. Every object creation or change is done by the Overseer from the staged script
  (`COD-1-02`, `COD-1-05`).
- **COD-20-06 [B]** **The build includes the database itself.** The SQL build set has a script
  that creates the database not applicable yet (no database) (`CREATE DATABASE` with its owner, encoding and
  locale) and the schemas of `COD-20-02`, so the whole database can be rebuilt from scratch. It is
  written so it can be skipped or run safely when the database already exists (for example the
  `CREATE DATABASE` statement commented out with a note, or guarded), and the Orchestrator says
  which statements to skip on a machine where the database already exists.
- **COD-20-07 [B]** **Users and roles live in their own file, outside version control.** All
  `CREATE ROLE` / `CREATE USER` / `ALTER ROLE … PASSWORD` statements go in one separate file,
  not applicable yet (no database), and nowhere else. Every other script refers to roles by name only (grants
  stay with their objects). The roles file:
  - is listed in `.gitignore` and is never committed, pushed or included in git backups;
  - carries no real password — each one is a placeholder such as `'<SET_PASSWORD>'` that the
    Overseer fills in locally;
  - is run before the object scripts on a new database, since the grants need the roles.
  Agents never write a real credential into any file (`COD-14-01`).
