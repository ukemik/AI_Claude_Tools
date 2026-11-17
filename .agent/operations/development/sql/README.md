# sql/ — Staged Database Changes

*Delete this folder (and `COD-1-02`, `COD-1-05` become not applicable) if the project has no
database.*

New or changed database functions, procedures and migrations are **staged here by the
Orchestrator**, never run by any agent (`COD-1-02`, `COD-1-05`).

- **Name each file after its target file** in not applicable yet (no database) (the project's canonical SQL
  build files), so the Human Overseer knows where it belongs.
- **One-time commands are not staged here.** A command the Overseer runs in the database once (a
  data fix, a grant, a verification query), and any other SQL for the Overseer or an agent to
  check, goes in the sql sub-folder of `.agent/temp/`, named after its task (`PRJ-4a-03`,
  `PRJ-4a-04`, `PRJ-4a-05`). It is handed over as `PRJ-4a-07` says, and its SQL is printed in the
  chat like any other (`COD-1-05`).
- A new function is a **hard stop** (`COD-12-04`): it needs the Overseer's approval before it is
  written.
- When a file is ready, the Orchestrator **prints its complete SQL in the chat** and says which
  build file it belongs in, and where. The Overseer creates it; dependent work waits.
- After the Overseer confirms, the Orchestrator verifies the object **read-only** as
  not applicable yet (no database) (signature, grants) before dispatching dependent work.
- Files stay here as the record of what was handed over.
- **Database creation** (`COD-20-06`): the build set includes a script that creates
  not applicable yet (no database) and its schemas; on a machine where the database already exists, skip the
  `CREATE DATABASE` statement.
- **Users and roles** (`COD-20-07`): every role and user statement goes only in
  not applicable yet (no database), which is in `.gitignore`, holds password placeholders only, and runs before
  the object scripts. A staged roles change is printed in the chat like any other script, but its
  file is never committed.
- **Order on a new database:** 1. database creation, 2. not applicable yet (no database), 3. schema and object
  scripts.
