## Project checks (AI_Claude_Tools)

- At every session start the hook `<CLAUDE_HOME>\hooks\project-checks\run-checks.ps1` checks the
  project. When it finds something, it hands you numbered questions starting with
  `project-checks:`. Ask them first, as it says.
- Source: `<TOOLS_DIR>` (the user's AI_Claude_Tools git repository, folder `Claude_Hooks`).
  Installed by `Claude_Hooks\install.ps1`. Never edit the installed copy under `<CLAUDE_HOME>`:
  change the source, raise `project-checks\VERSION`, run `install.ps1` again.
- Each check is one file `project-checks\checks\<name>.ps1`: it takes `-ProjectRoot` and
  `-ClaudeHome`, prints one line per question (what it found, what to do on yes), and never
  changes files. A project opts out of a check with the file `.claude\declined\<name>`.
- When the user makes a change that every project should get (a new ai_dev_package version, a
  new convention, a new required file), ask whether to add or update a check for it, so it is
  not forgotten.
- The aim metrics check is separate: ai_metrics_package installs and owns it.

## Installed package copies under `<CLAUDE_HOME>`

Sessions and checks use these copies, not the source folders. Whenever a new version of either
package is published, the copy must be refreshed too. When the user publishes a package, or
you notice the copy is older than the release, remind them and offer the step:

| Package | Installed copy | How to refresh it |
|---|---|---|
| ai_dev_package | `<CLAUDE_HOME>\ai_dev_package` | Run `<TOOLS_DIR>\install.ps1` (mirrors the release into the copy), or `robocopy <release folder> <CLAUDE_HOME>\ai_dev_package /MIR` |
| ai_metrics_package | `<CLAUDE_HOME>\aim\ai_metrics_package` (scripts in `<CLAUDE_HOME>\aim\installation`) | Not a plain copy: follow §8 "Upgrade" of `<CLAUDE_HOME>\aim\installation\INSTALLATION_SYSTEM.md` (package, environment, scripts, database), with every Claude Code window closed |
