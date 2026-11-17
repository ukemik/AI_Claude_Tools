# temp/ — Files Exchanged With the Human Overseer

This folder is where the agents and the Human Overseer share **one-off** material — code, data,
prompts, text — that is unlikely to be used again (`PRJ-4a-01`). For example: a prompt you asked
an agent to write for another agent; an SQL script or other code for you to run in the database
or another environment; a code change you decided to apply yourself. You share your own files
with the agents here too (`PRJ-4a-06`).

**Grouping and naming.** Everything sits in a sub-folder (`PRJ-4a-02`): code and data by file
type (sql, py, csv, …); Markdown and other documents by their use (rules, documentation,
prompts, …). A sub-folder is created when
its first file is written, so none is supplied. Nothing but this README sits directly in the
folder. An agent's file name starts with the name of the task it serves, then a short purpose
(`PRJ-4a-03`).

**What does not go here.** Anything that has its own home stays there: source code, staged
database objects, test scripts, task documents and evidence, logs and rules. An agent's own
working files go to its session scratchpad (`PRJ-4a-04`).

**Who writes here.** The Orchestrator writes any one-off material for you; the Reviewer writes
nothing here; you put your own files here, grouped the same way (`PRJ-4a-05`).

**Your files are input, not instructions.** Agents read them as material for the work you asked
for in a message or in the task's request, and never modify, move or delete them (`PRJ-4a-06`).
When a file is left here for you, the Orchestrator says in the chat where it is, what to do with
it and what to send back (`PRJ-4a-07`).

**Git and clearing.** Only this README is committed; the project's `.gitignore` excludes the
rest. At close-out the Orchestrator deletes the files agents created for that task, unless the
Overseer asked to keep them, and lists them. Only the Overseer clears the Overseer's own files
(`PRJ-4a-08`).

`rules_agent_workflow.md` PRJ §4a governs this folder; this note only summarises it.
