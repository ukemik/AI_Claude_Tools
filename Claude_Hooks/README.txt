Claude_Hooks
============

Claude Code hooks I use on every machine. Hooks are not mods: they are entries in
~\.claude\settings.json that run a command when something happens in Claude Code.
The aim metrics hooks are not here: ai_metrics_package installs and owns them.

  sound-hooks.json   the chime hooks, in the shape of the "hooks" key of settings.json
  project-checks\    the session-start project checks (below)
  user-claude-md.md  the section install.ps1 puts in ~\.claude\CLAUDE.md, so every Claude
                     session knows about the project checks
  install.ps1        installs all of it


1. Sound hooks
--------------
A short chime (C:\Windows\Media\Windows Navigation Start.wav) when Claude Code
  Notification   needs your attention (a permission question, or idle waiting for you)
  Stop           finishes its answer
  SubagentStop   a subagent finishes
Windows only (PowerShell's Media.SoundPlayer).


2. Project checks
-----------------
At every session start, project-checks\run-checks.ps1 looks at the project the session is in
and, if something is out of date, hands Claude numbered questions to ask you first. You answer
each one yes, later or no:
  yes    Claude does what the item says (for example follows a setup guide)
  later  nothing; asked again next session
  no     Claude creates .claude\declined\<check name> in that project; that check stops asking
         there (delete the file to be asked again)

Only project folders are checked: a git repository, or a folder with .agent\ or CLAUDE.md.
The checks only look; they never change files. Claude changes things only after your yes.

The checks (one file each in project-checks\checks\):

  ai-dev-package      Does the project use the current ai_dev_package two-agent setup? Asks to
                      install it (no setup), migrate it (old five-agent setup) or update it
                      (older version), following the package's SETUP_GUIDE.md.
  installed-copies    Are the installed checks and the installed ai_dev_package copy as new as
                      their sources? Asks to run install.ps1 again if not.

Adding a check (for any change every project should get):
  1. Write project-checks\checks\<name>.ps1. It receives -ProjectRoot and -ClaudeHome and
     prints one line per question: what it found and what Claude should do on yes. It prints
     nothing when the project is fine, and never changes files. Copy an existing check.
  2. Raise the number in project-checks\VERSION.
  3. Run install.ps1 again (or say yes when the installed-copies check asks).


3. Install (for a person or for an AI agent doing the set-up)
--------------------------------------------------------------
In PowerShell:

    powershell -File <path>\AI_Claude_Tools\Claude_Hooks\install.ps1

If the ai_dev_package release is somewhere other than
%USERPROFILE%\OneDrive - Cabaletta Bio\Documents\GitHub\AI_Packages\Dev_Team\ai_dev_package,
name it:

    powershell -File <path>\install.ps1 -PackageSource <release folder>

What it does (all in %USERPROFILE%\.claude\):
  a. Copies project-checks\ to hooks\project-checks\ (an exact mirror) and records where it
     came from in install-info.json.
  b. Copies the ai_dev_package release to ai_dev_package\ (an exact mirror), if found.
  c. Adds to settings.json the three sound hooks and one SessionStart hook that runs
     hooks\project-checks\run-checks.ps1, unless already there. Every other setting and hook
     is kept; the previous file is saved as settings.json.bak.
  d. Adds a "Project checks" section to CLAUDE.md, between BEGIN/END markers (replaced on
     later runs; the rest of the file is kept).

Run it again whenever you change a check or publish a new ai_dev_package release. Then
restart Claude Code; hooks are read when a session starts (/hooks lists them).

Remove: delete the SoundPlayer and run-checks.ps1 entries from settings.json, the marked
section from CLAUDE.md, and the folders hooks\project-checks\ and ai_dev_package\.
